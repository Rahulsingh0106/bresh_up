export default function Testimonials() {
  const testimonials = [
    {
      body: "BreshUP completely transformed my interview prep. The AI interviewer asked exactly the kinds of questions I got in my real frontend interviews. Highly recommended!",
      author: {
        name: "Sarah Jenkins",
        handle: "@sarahjcodes",
        role: "Frontend Engineer at TechCorp",
        imageUrl: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random"
      }
    },
    {
      body: "The learning roadmaps gave me the structured path I needed, and the mock interviews helped me build the confidence to speak clearly about my backend architecture decisions.",
      author: {
        name: "Michael Chen",
        handle: "@mchen_dev",
        role: "Backend Developer",
        imageUrl: "https://ui-avatars.com/api/?name=Michael+Chen&background=random"
      }
    },
    {
      body: "I love the detailed JSON feedback after each interview. It highlighted exactly where my system design knowledge was weak so I could focus my studying.",
      author: {
        name: "Alex Rivera",
        handle: "@alexr_codes",
        role: "Full Stack Developer",
        imageUrl: "https://ui-avatars.com/api/?name=Alex+Rivera&background=random"
      }
    }
  ];

  return (
    <div className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Loved by developers worldwide
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.author.handle} className="flex flex-col justify-between bg-card rounded-2xl p-8 shadow-sm border border-border">
                <blockquote className="text-muted-foreground leading-7">
                  <p>{`"${testimonial.body}"`}</p>
                </blockquote>
                <div className="mt-6 flex items-center gap-x-4">
                  <img className="h-10 w-10 rounded-full bg-muted" src={testimonial.author.imageUrl} alt="" />
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.author.name}</div>
                    <div className="text-sm leading-6 text-muted-foreground">{testimonial.author.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
