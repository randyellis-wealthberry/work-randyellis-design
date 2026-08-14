export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  source?: string;
}

/**
 * Real, attributable recommendations from Randy Ellis's LinkedIn profile.
 * Verified against his product design deck (slides 46–47). Do not add
 * testimonials here without a real, named, public source.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Randy is a thoughtful and empathetic designer with the ability to teach complex concepts. He would play well in the leadership space, and if you need someone to partner with to build a practice for your agency or client, I would recommend taking a serious look at Randy.",
    author: "Paul Grachen",
    role: "VP / Director of Experience Design, Digitas / Leo Burnett",
    source: "LinkedIn recommendation",
  },
  {
    quote:
      "Randy is a professional and helpful instructor who has the ability to teach a class with enthusiasm. He possesses an in-depth knowledge of user experience design and leads by example — he will always be considered one of the best teachers that I've ever met.",
    author: "Donald Wu",
    role: "Senior Graphic Designer, Hickory Farms",
    source: "LinkedIn recommendation",
  },
];
