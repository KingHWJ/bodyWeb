import type { Metadata } from "next";

import { ExerciseLibraryClient } from "@/components/exercises/exercise-library-client";
import { PageSection } from "@/components/ui/page-section";
import { readExerciseLibraryItems } from "@/lib/content/exercise-library-data";

export const metadata: Metadata = {
  title: "健身动作列表",
  description: "支持模糊搜索的动作库，直接查看动作说明和中级 / 高级能力要求。",
};

export default async function ExerciseLibraryPage() {
  const items = await readExerciseLibraryItems();

  return (
    <PageSection
      eyebrow="Exercise Library"
      title="健身动作列表与能力要求"
      description="这个页面把全部普通动作整理成一个可搜索动作库。你可以直接搜中文、英文、slug 或缩写，快速查看动作说明和能力要求，再进入完整标准页。"
    >
      <ExerciseLibraryClient items={items} />
    </PageSection>
  );
}
