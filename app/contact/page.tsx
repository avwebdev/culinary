import { Hero } from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  return (
    <div>
      <Hero />
      <div className="min-h-screen bg-black p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-medium mb-6 text-amber-400">Contact Us</h1>

        <div className="mb-8 text-gray-200 space-y-4">
          <p>
            6speed Photography is available to undertake photographic projects in the Bay Area. Contact us here to
            discuss your requirements in more detail.
          </p>

          <div className="space-y-1">
            <p>Location: Pleasanton, CA</p>
            <p>Telephone: idk</p>
            <p>Email: idk</p>
          </div>
        </div>

        <form
        //  onSubmit={handleSubmit}
         className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              placeholder="FIRST NAME"
              className="bg-black border-amber-400 text-white placeholder:text-gray-500"
              // value={formData.firstName}
              // onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <Input
              placeholder="LAST NAME"
              className="bg-black border-amber-400 text-white placeholder:text-gray-500"
              // value={formData.lastName}
              // onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            <Input
              placeholder="NUMBER"
              type="tel"
              className="bg-black border-amber-400 text-white placeholder:text-gray-500"
              // value={formData.number}
              // onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            />
            <Input
              placeholder="EMAIL"
              type="email"
              className="bg-black border-amber-400 text-white placeholder:text-gray-500"
              // value={formData.email}
              // onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <Textarea
            placeholder="MESSAGE"
            className="bg-black border-amber-400 text-white placeholder:text-gray-500 min-h-[120px]"
            // value={formData.message}
            // onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />

          <Button type="submit" className="bg-white text-black hover:bg-gray-200 px-8">
            SEND
          </Button>
        </form>
      </div>
    </div>
    </div>
  );
}
