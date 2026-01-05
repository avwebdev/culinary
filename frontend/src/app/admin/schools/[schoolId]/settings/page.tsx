"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  BlacklistedDate,
  RecurringBlacklist,
  OrderingSettings,
} from "@/lib/api/orders";
import { formatDate, getPatternDescription, toISODateString } from "@/lib/date-utils";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

// Extended session type to include Strapi JWT
interface ExtendedSession {
  jwt?: string;
  id?: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const WEEKDAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const WEEK_OPTIONS = [
  { value: 1, label: "First" },
  { value: 2, label: "Second" },
  { value: 3, label: "Third" },
  { value: 4, label: "Fourth" },
  { value: -1, label: "Last" },
];

export default function SchoolSettingsPage() {
  const { data: session } = useSession();
  const extSession = session as ExtendedSession | null;
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;

  const [settings, setSettings] = useState<OrderingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [cutoffTime, setCutoffTime] = useState("14:00");
  const [advanceOrderDays, setAdvanceOrderDays] = useState(1);
  const [blacklistedDates, setBlacklistedDates] = useState<BlacklistedDate[]>([]);
  const [recurringBlacklists, setRecurringBlacklists] = useState<RecurringBlacklist[]>([]);

  // Multi-select calendar state
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [newDateReason, setNewDateReason] = useState("");

  // Recurring pattern form state
  const [patternType, setPatternType] = useState<"dayOfWeek" | "dayOfMonth" | "weekOfMonth">("dayOfWeek");
  const [patternValue, setPatternValue] = useState(0);
  const [patternWeek, setPatternWeek] = useState(1);
  const [patternDayOfWeek, setPatternDayOfWeek] = useState(0);
  const [patternReason, setPatternReason] = useState("");

  // CSV upload state
  const [csvContent, setCsvContent] = useState("");
  const [csvPreview, setCsvPreview] = useState<BlacklistedDate[]>([]);

  // Conflict warning dialog
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [conflictInfo, setConflictInfo] = useState<{
    count: number;
    datesToAdd: BlacklistedDate[];
  } | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/schools/${schoolId}/ordering-settings`);
      if (!response.ok) throw new Error("Failed to fetch settings");
      
      const data: OrderingSettings = await response.json();
      setSettings(data);
      setCutoffTime(data.orderCutoffTime || "14:00");
      setAdvanceOrderDays(data.advanceOrderDays ?? 1);
      setBlacklistedDates(data.blacklistedDates || []);
      setRecurringBlacklists(data.recurringBlacklists || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    if (session && schoolId) {
      fetchSettings();
    }
  }, [session, schoolId, fetchSettings]);

  const handleSaveSettings = async () => {
    if (!extSession?.jwt) {
      setError("Not authenticated");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`${API_URL}/api/schools/${schoolId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${extSession.jwt}`,
        },
        body: JSON.stringify({
          data: {
            orderCutoffTime: cutoffTime,
            advanceOrderDays,
            blacklistedDates,
            recurringBlacklists,
          },
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "Failed to save settings");
      }

      setSuccess("Settings saved successfully!");
      await fetchSettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSelectedDates = async () => {
    if (selectedDates.length === 0) {
      setError("Please select at least one date");
      return;
    }

    if (!newDateReason.trim()) {
      setError("Please provide a reason");
      return;
    }

    const newDates: BlacklistedDate[] = selectedDates.map((date) => ({
      date: toISODateString(date),
      reason: newDateReason.trim(),
    }));

    // Check for pending orders
    const dateStrings = newDates.map((d) => d.date).join(",");
    try {
      const response = await fetch(
        `${API_URL}/api/schools/${schoolId}/pending-orders-for-dates?dates=${dateStrings}`,
        {
          headers: {
            Authorization: `Bearer ${extSession?.jwt}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.totalPending > 0) {
          setConflictInfo({
            count: data.totalPending,
            datesToAdd: newDates,
          });
          setShowConflictDialog(true);
          return;
        }
      }
    } catch {
      // Continue even if check fails
    }

    addDatesToBlacklist(newDates);
  };

  const addDatesToBlacklist = (newDates: BlacklistedDate[]) => {
    const existingSet = new Set(blacklistedDates.map((d) => d.date));
    const uniqueNew = newDates.filter((d) => !existingSet.has(d.date));
    setBlacklistedDates([...blacklistedDates, ...uniqueNew]);
    setSelectedDates([]);
    setNewDateReason("");
    setShowConflictDialog(false);
    setConflictInfo(null);
  };

  const handleRemoveBlacklistedDate = (dateToRemove: string) => {
    setBlacklistedDates(blacklistedDates.filter((d) => d.date !== dateToRemove));
  };

  const handleAddRecurringPattern = () => {
    if (!patternReason.trim()) {
      setError("Please provide a reason for the recurring pattern");
      return;
    }

    const newPattern: RecurringBlacklist = {
      type: patternType,
      reason: patternReason.trim(),
    };

    if (patternType === "dayOfWeek") {
      newPattern.value = patternValue;
    } else if (patternType === "dayOfMonth") {
      newPattern.value = patternValue || 1;
    } else if (patternType === "weekOfMonth") {
      newPattern.week = patternWeek;
      newPattern.dayOfWeek = patternDayOfWeek;
    }

    setRecurringBlacklists([...recurringBlacklists, newPattern]);
    setPatternReason("");
  };

  const handleRemoveRecurringPattern = (index: number) => {
    setRecurringBlacklists(recurringBlacklists.filter((_, i) => i !== index));
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvContent(content);
      
      // Parse CSV preview
      const lines = content.split("\n").map((l) => l.trim()).filter((l) => l);
      const preview: BlacklistedDate[] = [];
      
      for (const line of lines) {
        if (line.toLowerCase().startsWith("date")) continue; // Skip header
        const parts = line.split(",");
        if (parts.length >= 1) {
          const date = parts[0].trim();
          const reason = parts.slice(1).join(",").trim() || "Blocked";
          if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            preview.push({ date, reason });
          }
        }
      }
      
      setCsvPreview(preview);
    };
    reader.readAsText(file);
  };

  const handleImportCsv = () => {
    if (csvPreview.length === 0) {
      setError("No valid dates found in CSV");
      return;
    }

    const existingSet = new Set(blacklistedDates.map((d) => d.date));
    const uniqueNew = csvPreview.filter((d) => !existingSet.has(d.date));
    setBlacklistedDates([...blacklistedDates, ...uniqueNew]);
    setCsvContent("");
    setCsvPreview([]);
    setSuccess(`Imported ${uniqueNew.length} dates`);
  };

  // Handle multi-select calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const dateString = toISODateString(date);
    const isSelected = selectedDates.some((d) => toISODateString(d) === dateString);
    
    if (isSelected) {
      setSelectedDates(selectedDates.filter((d) => toISODateString(d) !== dateString));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  if (!session) {
    return <div className="p-8">Please log in to access this page.</div>;
  }

  if (isLoading) {
    return <div className="p-8">Loading settings...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">School Ordering Settings</h1>
          {settings && <p className="text-gray-600">{settings.name}</p>}
        </div>
        <Button onClick={() => router.back()} variant="outline">
          Back
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Order Window Settings</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="cutoffTime">Daily Cutoff Time</Label>
              <Input
                id="cutoffTime"
                type="time"
                value={cutoffTime}
                onChange={(e) => setCutoffTime(e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Orders must be placed before this time
              </p>
            </div>

            <div>
              <Label htmlFor="advanceDays">Advance Order Days</Label>
              <Input
                id="advanceDays"
                type="number"
                min={0}
                value={advanceOrderDays}
                onChange={(e) => setAdvanceOrderDays(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum days before delivery date
              </p>
            </div>
          </div>
        </div>

        {/* Recurring Patterns */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recurring Blackout Patterns</h2>
          
          <div className="space-y-4">
            <div>
              <Label>Pattern Type</Label>
              <Select
                value={patternType}
                onValueChange={(v) => setPatternType(v as typeof patternType)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dayOfWeek">Day of Week</SelectItem>
                  <SelectItem value="dayOfMonth">Day of Month</SelectItem>
                  <SelectItem value="weekOfMonth">Week of Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {patternType === "dayOfWeek" && (
              <div>
                <Label>Day</Label>
                <Select
                  value={patternValue.toString()}
                  onValueChange={(v) => setPatternValue(parseInt(v))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WEEKDAYS.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {patternType === "dayOfMonth" && (
              <div>
                <Label>Day of Month (1-31)</Label>
                <Input
                  type="number"
                  min={1}
                  max={31}
                  value={patternValue || 1}
                  onChange={(e) => setPatternValue(parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
              </div>
            )}

            {patternType === "weekOfMonth" && (
              <>
                <div>
                  <Label>Week</Label>
                  <Select
                    value={patternWeek.toString()}
                    onValueChange={(v) => setPatternWeek(parseInt(v))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WEEK_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value.toString()}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Day of Week</Label>
                  <Select
                    value={patternDayOfWeek.toString()}
                    onValueChange={(v) => setPatternDayOfWeek(parseInt(v))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WEEKDAYS.map((day) => (
                        <SelectItem key={day.value} value={day.value.toString()}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div>
              <Label>Reason</Label>
              <Input
                value={patternReason}
                onChange={(e) => setPatternReason(e.target.value)}
                placeholder="e.g., Weekends closed"
                className="mt-1"
              />
            </div>

            <Button onClick={handleAddRecurringPattern} className="w-full">
              Add Recurring Pattern
            </Button>
          </div>

          {/* Current Recurring Patterns */}
          {recurringBlacklists.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Active Patterns:</h3>
              <div className="space-y-2">
                {recurringBlacklists.map((pattern, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded"
                  >
                    <div>
                      <span className="font-medium">
                        {getPatternDescription(pattern)}
                      </span>
                      <span className="text-gray-500 ml-2">- {pattern.reason}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRecurringPattern(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Multi-Select Calendar for Specific Dates */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Add Blackout Dates</h2>
          
          <div className="mb-4">
            <Calendar
              mode="single"
              selected={undefined}
              onSelect={handleDateSelect}
              modifiers={{
                selected: selectedDates,
                blacklisted: blacklistedDates.map((d) => new Date(d.date + "T00:00:00")),
              }}
              modifiersStyles={{
                selected: { backgroundColor: "#3b82f6", color: "white" },
                blacklisted: { backgroundColor: "#ef4444", color: "white" },
              }}
              className="rounded-md border"
            />
          </div>

          {selectedDates.length > 0 && (
            <div className="space-y-4">
              <div>
                <Label>Selected Dates:</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedDates.map((date) => (
                    <Badge key={toISODateString(date)} variant="secondary">
                      {formatDate(date)}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Reason (applies to all selected)</Label>
                <Input
                  value={newDateReason}
                  onChange={(e) => setNewDateReason(e.target.value)}
                  placeholder="e.g., Holiday, School Event"
                  className="mt-1"
                />
              </div>

              <Button onClick={handleAddSelectedDates} className="w-full">
                Add {selectedDates.length} Date(s) to Blacklist
              </Button>
            </div>
          )}
        </div>

        {/* CSV Import */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Import from CSV</h2>
          
          <div className="space-y-4">
            <div>
              <Label>Upload CSV File</Label>
              <Input
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Format: date,reason (one per line, date as YYYY-MM-DD)
              </p>
            </div>

            {csvPreview.length > 0 && (
              <div>
                <Label>Preview ({csvPreview.length} dates):</Label>
                <div className="max-h-40 overflow-y-auto border rounded p-2 mt-1">
                  {csvPreview.slice(0, 10).map((item, index) => (
                    <div key={index} className="text-sm">
                      {item.date} - {item.reason}
                    </div>
                  ))}
                  {csvPreview.length > 10 && (
                    <div className="text-sm text-gray-500">
                      ...and {csvPreview.length - 10} more
                    </div>
                  )}
                </div>
                <Button onClick={handleImportCsv} className="w-full mt-2">
                  Import {csvPreview.length} Dates
                </Button>
              </div>
            )}
          </div>

          {/* Current Blacklisted Dates */}
          <div className="mt-6">
            <h3 className="font-medium mb-2">
              Blacklisted Dates ({blacklistedDates.length}):
            </h3>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {blacklistedDates.slice(0, 20).map((item) => (
                <div
                  key={item.date}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm"
                >
                  <div>
                    <span className="font-medium">{item.date}</span>
                    <span className="text-gray-500 ml-2">- {item.reason}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveBlacklistedDate(item.date)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </Button>
                </div>
              ))}
              {blacklistedDates.length > 20 && (
                <div className="text-sm text-gray-500 p-2">
                  ...and {blacklistedDates.length - 20} more dates
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
          size="lg"
          className="px-8"
        >
          {isSaving ? "Saving..." : "Save All Settings"}
        </Button>
      </div>

      {/* Conflict Warning Dialog */}
      <AlertDialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Pending Orders Will Be Cancelled</AlertDialogTitle>
            <AlertDialogDescription>
              There are <strong>{conflictInfo?.count}</strong> pending order(s) for the
              selected dates. If you proceed, these orders will be automatically
              cancelled and customers will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => conflictInfo && addDatesToBlacklist(conflictInfo.datesToAdd)}
              className="bg-red-600 hover:bg-red-700"
            >
              Proceed and Cancel Orders
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
