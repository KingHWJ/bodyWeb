import inventory from "../../../content/inventory.json";

import { readNormalizedExerciseData } from "@/lib/content/standards-data";
import { buildExerciseLibraryItem } from "@/lib/domain/exercise-library";

export async function readExerciseLibraryItems() {
  // 动作库页依赖本地 normalized 数据构建静态索引，避免运行时再请求外部站点。
  const items = await Promise.all(
    inventory.exerciseStandardSlugs.map(async (slug) => {
      const data = await readNormalizedExerciseData(slug, "kg");
      return buildExerciseLibraryItem(slug, data);
    }),
  );

  return items;
}
