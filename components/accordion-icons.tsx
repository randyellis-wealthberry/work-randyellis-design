import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/core/accordion";
import { ChevronUp } from "lucide-react";

export function AccordionIcons() {
  return (
    <Accordion
      className="flex w-full flex-col divide-y divide-zinc-200 dark:divide-zinc-700"
      transition={{ duration: 0.2 }}
    >
      <AccordionItem value="5by5-conversation" className="py-2">
        <AccordionTrigger className="w-full text-left text-zinc-950 dark:text-zinc-50">
          <div className="flex items-center justify-between">
            <div>
              5by5 Conversation: Being a Black Designer in America (2020)
            </div>
            <ChevronUp className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 text-zinc-500 dark:text-zinc-400">
            <div className="flex flex-col space-y-2 border-b border-zinc-200 pb-4 dark:border-zinc-700">
              <h4 className="font-semibold text-zinc-950 dark:text-zinc-50">
                Article Details
              </h4>
              <p>
                <span className="font-medium">Published:</span> July 22, 2020
              </p>
              <p>
                <span className="font-medium">Authors:</span> Thomas Brandenburg
                & Twisha Shah-Brandenburg
              </p>
              <p>
                <span className="font-medium">Publication:</span> 5by5
                Conversations on Medium
              </p>
              <p>
                <span className="font-medium">Read Time:</span> 13 minutes
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-zinc-950 dark:text-zinc-50">
                Summary
              </h4>
              <p className="mb-3">
                An in-depth interview exploring Randy Ellis&apos;s journey as a
                Black designer in America, covering his non-traditional
                educational path, workplace challenges, and insights on design
                practice and community.
              </p>
              <div className="mb-3">
                <span className="font-medium">Key Topics:</span>
                <ul className="mt-1 list-inside list-disc space-y-1">
                  <li>Educational journey and self-taught UX design</li>
                  <li>Workplace challenges and navigating corporate culture</li>
                  <li>The lack of Black representation in design</li>
                  <li>Black Lives Matter movement and social justice</li>
                  <li>Advice for aspiring Black and Brown designers</li>
                </ul>
              </div>
              <a
                href="https://medium.com/@5by5conversations/a-5by5-conversation-with-randy-ellis-being-a-black-designer-in-america-1a4c5bb6c793"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Read Full Article →
              </a>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="revision-path-podcast" className="py-2">
        <AccordionTrigger className="w-full text-left text-zinc-950 dark:text-zinc-50">
          <div className="flex items-center justify-between">
            <div>Revision Path Podcast Episode (2019)</div>
            <ChevronUp className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 text-zinc-500 dark:text-zinc-400">
            <div className="flex flex-col space-y-2 border-b border-zinc-200 pb-4 dark:border-zinc-700">
              <h4 className="font-semibold text-zinc-950 dark:text-zinc-50">
                Episode Details
              </h4>
              <p>
                <span className="font-medium">Episode:</span> 320
              </p>
              <p>
                <span className="font-medium">Published:</span> November 11,
                2019
              </p>
              <p>
                <span className="font-medium">Host:</span> Maurice Cherry
              </p>
              <p>
                <span className="font-medium">Show:</span> Revision Path
              </p>
              <p>
                <span className="font-medium">Duration:</span> 1:18:47
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-zinc-950 dark:text-zinc-50">
                Summary
              </h4>
              <p className="mb-3">
                Randy Ellis discusses his work as a UX strategist and consultant
                in Chicago, his consultancy 5ivehat UX Agency, diversity in the
                design community, design education, teaching at General
                Assembly, and even cryptocurrency.
              </p>
              <div className="mb-3">
                <span className="font-medium">Topics Covered:</span>
                <ul className="mt-1 list-inside list-disc space-y-1">
                  <li>UX strategy and consulting work</li>
                  <li>5ivehat UX Agency business</li>
                  <li>Diversity in the design community</li>
                  <li>Design education and for-profit university model</li>
                  <li>Teaching experience at General Assembly</li>
                  <li>Cryptocurrency discussion</li>
                </ul>
              </div>
              <div className="space-y-2">
                <a
                  href="https://www.youtube.com/watch?v=OprQOPmeB7w"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Watch Video →
                </a>
                <br />
                <a
                  href="https://revisionpath.com/randy-ellis/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Episode Page →
                </a>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="ixda-black-mirror" className="py-2">
        <AccordionTrigger className="w-full text-left text-zinc-950 dark:text-zinc-50">
          <div className="flex items-center justify-between">
            <div>IxDA: Black Mirror Event (2018)</div>
            <ChevronUp className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 text-zinc-500 dark:text-zinc-400">
            <div className="flex flex-col space-y-2 border-b border-zinc-200 pb-4 dark:border-zinc-700">
              <h4 className="font-semibold text-zinc-950 dark:text-zinc-50">
                Video Details
              </h4>
              <p>
                <span className="font-medium">Event:</span> IxDA Black Mirror
                Event
              </p>
              <p>
                <span className="font-medium">Uploaded:</span> August 4, 2018
              </p>
              <p>
                <span className="font-medium">Duration:</span> 1:32:06
              </p>
              <p>
                <span className="font-medium">Platform:</span> Vimeo
              </p>
              <p>
                <span className="font-medium">Uploaded by:</span> 5ivehat
              </p>
              <p>
                <span className="font-medium">Location:</span> Chicago, IL, USA
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-zinc-950 dark:text-zinc-50">
                About
              </h4>
              <p className="mb-3">
                A presentation or discussion event related to the Interaction
                Design Association (IxDA) focusing on Black Mirror themes,
                exploring the intersection of design, technology, and society
                through the lens of the popular dystopian series.
              </p>
              <a
                href="https://vimeo.com/283187480"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Watch Video →
              </a>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="vimeo-presentation" className="py-2">
        <AccordionTrigger className="w-full text-left text-zinc-950 dark:text-zinc-50">
          <div className="flex items-center justify-between">
            <div>Design Presentation Video</div>
            <ChevronUp className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 text-zinc-500 dark:text-zinc-400">
            <div className="flex flex-col space-y-2 border-b border-zinc-200 pb-4 dark:border-zinc-700">
              <h4 className="font-semibold text-zinc-950 dark:text-zinc-50">
                Video Details
              </h4>
              <p>
                <span className="font-medium">Platform:</span> Vimeo
              </p>
              <p>
                <span className="font-medium">Video ID:</span> 360664847
              </p>
              <p>
                <span className="font-medium">Type:</span> Design/UX
                Presentation
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-zinc-950 dark:text-zinc-50">
                About
              </h4>
              <p className="mb-3">
                A design presentation or talk featuring Randy Ellis discussing
                UX design, strategy, or related topics in the design community.
              </p>
              <a
                href="https://vimeo.com/360664847"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Watch Video →
              </a>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="locallux-demo-day" className="py-2">
        <AccordionTrigger className="w-full text-left text-zinc-950 dark:text-zinc-50">
          <div className="flex items-center justify-between">
            <div>LocalLux @ Straightshot&apos;s Demo Day (2015)</div>
            <ChevronUp className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 text-zinc-500 dark:text-zinc-400">
            <div className="flex flex-col space-y-2 border-b border-zinc-200 pb-4 dark:border-zinc-700">
              <h4 className="font-semibold text-zinc-950 dark:text-zinc-50">
                Video Details
              </h4>
              <p>
                <span className="font-medium">Event:</span> LocalLux @
                Straightshot&apos;s Demo Day
              </p>
              <p>
                <span className="font-medium">Uploaded:</span> July 9, 2015
              </p>
              <p>
                <span className="font-medium">Duration:</span> 2:48
              </p>
              <p>
                <span className="font-medium">Platform:</span> Vimeo
              </p>
              <p>
                <span className="font-medium">Uploaded by:</span> 5ivehat
              </p>
              <p>
                <span className="font-medium">Featured on:</span> Channel 7 KETV
                Omaha
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-zinc-950 dark:text-zinc-50">
                About
              </h4>
              <p className="mb-3">
                Randy Ellis featured as LocalLux CEO on Channel 7 KETV Omaha
                during Straightshot&apos;s Demo Day event. A glimpse into his
                entrepreneurial journey and startup experience in the tech
                industry.
              </p>
              <a
                href="https://vimeo.com/133075973"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Watch Video →
              </a>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="locallux-kickoff" className="py-2">
        <AccordionTrigger className="w-full text-left text-zinc-950 dark:text-zinc-50">
          <div className="flex items-center justify-between">
            <div>LocalLux @ Straightshot&apos;s Kick-Off (2015)</div>
            <ChevronUp className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 text-zinc-500 dark:text-zinc-400">
            <div className="flex flex-col space-y-2 border-b border-zinc-200 pb-4 dark:border-zinc-700">
              <h4 className="font-semibold text-zinc-950 dark:text-zinc-50">
                Video Details
              </h4>
              <p>
                <span className="font-medium">Event:</span> LocalLux @
                Straightshot&apos;s Kick-Off
              </p>
              <p>
                <span className="font-medium">Uploaded:</span> July 9, 2015
              </p>
              <p>
                <span className="font-medium">Platform:</span> Vimeo
              </p>
              <p>
                <span className="font-medium">Uploaded by:</span> 5ivehat
              </p>
              <p>
                <span className="font-medium">Featured on:</span> KETV Channel 7
              </p>
              <p>
                <span className="font-medium">Program:</span>{" "}
                Straightshot&apos;s Class of 2014
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-zinc-950 dark:text-zinc-50">
                About
              </h4>
              <p className="mb-3">
                Randy Ellis interviewed by KETV Channel 7 as LocalLux CEO for
                Straightshot&apos;s Class of 2014 kick-off event. An early look
                at his entrepreneurial journey and startup involvement.
              </p>
              <a
                href="https://vimeo.com/133075972"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Watch Video →
              </a>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
