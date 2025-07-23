"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { ExternalLink, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArchiveThumbnail } from "@/components/ui/archive-thumbnail";
import { BorderTrailCard } from "@/components/ui/border-trail-card";
import { ARCHIVE_ITEMS, ARCHIVE_CATEGORIES } from "../data";

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const VARIANTS_ITEM = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function ArchiveClient() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems = ARCHIVE_ITEMS.filter((item) =>
    activeCategory === "All" ? true : item.category === activeCategory,
  );

  return (
    <motion.main
      className="space-y-8"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section variants={VARIANTS_ITEM}>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Archive
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            A collection of old articles, presentations, and career footage
            spanning my journey in design and technology.
          </p>
        </div>
      </motion.section>

      <motion.section variants={VARIANTS_ITEM}>
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {ARCHIVE_CATEGORIES.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-8">
            {/* BorderTrail Cards Grid */}
            <motion.div className="mb-12" variants={VARIANTS_ITEM}>
              <h2 className="text-xl font-semibold mb-6 text-zinc-900 dark:text-zinc-100">
                Featured Components
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
                <BorderTrailCard />
                <BorderTrailCard />
                <BorderTrailCard />
                <BorderTrailCard />
              </div>
            </motion.div>

            {/* Archive Items Grid */}
            <motion.div
              className="grid gap-6 grid-cols-1 md:grid-cols-2"
              variants={VARIANTS_CONTAINER}
              initial="hidden"
              animate="visible"
            >
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={VARIANTS_ITEM}
                  className="h-full"
                >
                  <Card className="group relative overflow-hidden h-full flex flex-col">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <ArchiveThumbnail item={item} />
                    </a>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </CardTitle>
                          <CardDescription className="text-base font-medium">
                            {item.subtitle}
                          </CardDescription>
                          <CardDescription className="text-sm">
                            {item.description}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="space-y-4 flex-1">
                        {/* Item Details */}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-zinc-500" />
                            <span className="text-zinc-600 dark:text-zinc-400">
                              {item.year}
                            </span>
                          </div>
                          {item.company && (
                            <span className="text-zinc-600 dark:text-zinc-400">
                              {item.company}
                            </span>
                          )}
                          {item.event && (
                            <span className="text-zinc-600 dark:text-zinc-400">
                              {item.event}
                            </span>
                          )}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 4).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.tags.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Action Button - Always at bottom */}
                      <div className="flex gap-2 pt-4">
                        <Button asChild size="sm" className="flex-1">
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            {item.type === "video"
                              ? "Watch Video"
                              : "Read Article"}
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.section>
    </motion.main>
  );
}
