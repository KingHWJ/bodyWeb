import { describe, expect, it } from "vitest";

import {
  parseComparisonStandardsHtml,
  parseExerciseStandardsHtml,
} from "@/lib/content/standards-parser";

describe("力量标准 HTML 解析", () => {
  it("可以提取普通动作标准页摘要表", () => {
    const html = `
      <h2>Male Bench Press Standards (kg)</h2>
      <table>
        <tr><td>Beginner</td><td>47 kg</td></tr>
        <tr><td>Novice</td><td>70 kg</td></tr>
      </table>
      <h2>Female Bench Press Standards (kg)</h2>
      <table>
        <tr><td>Beginner</td><td>17 kg</td></tr>
        <tr><td>Novice</td><td>31 kg</td></tr>
      </table>
    `;

    expect(parseExerciseStandardsHtml(html)).toEqual({
      kind: "exercise",
      exerciseName: "Bench Press",
      unit: "kg",
      male: [
        { level: "Beginner", value: "47 kg" },
        { level: "Novice", value: "70 kg" },
      ],
      female: [
        { level: "Beginner", value: "17 kg" },
        { level: "Novice", value: "31 kg" },
      ],
      maleBodyweightRatio: [],
      femaleBodyweightRatio: [],
      maleByBodyweight: [],
      femaleByBodyweight: [],
      maleByAge: [],
      femaleByAge: [],
    });
  });

  it("可以解析真实页面里带 section-box 和 tabs 的普通动作结构", () => {
    const html = `
      <div class="tab">
        <div class="section-box">
          <h2 class="title">Male Bench Press Standards (kg)</h2>
          <div class="columns">
            <div class="column">
              <div class="tabs-container">
                <div class="tab">
                  <table>
                    <thead><tr><th>Strength Level</th><th>Weight</th></tr></thead>
                    <tbody>
                      <tr><td>Beginner</td><td>47 kg</td></tr>
                      <tr><td>Novice</td><td>70 kg</td></tr>
                    </tbody>
                  </table>
                </div>
                <div class="tab is-hidden">
                  <table>
                    <thead><tr><th>Strength Level</th><th>Bodyweight Ratio</th></tr></thead>
                    <tbody>
                      <tr><td>Beginner</td><td>0.50x</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <h3>By Weight and Age</h3>
          <div class="tabs-container block" data-tab-group="By Weight and Age">
            <div class="tab">
              <h4 class="tab-title subtitle is-4 is-size-5-mobile is-hidden">By Bodyweight</h4>
              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      <th><abbr title="Bodyweight"><span>BW</span></abbr></th>
                      <th><abbr title="Beginner"><span>Beg.</span></abbr></th>
                      <th><abbr title="Novice"><span>Nov.</span></abbr></th>
                      <th><abbr title="Intermediate"><span>Int.</span></abbr></th>
                      <th><abbr title="Advanced"><span>Adv.</span></abbr></th>
                      <th><abbr title="Elite"><span>Elite</span></abbr></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>50</td><td>24</td><td>38</td><td>57</td><td>79</td><td>103</td></tr>
                    <tr><td>55</td><td>29</td><td>45</td><td>64</td><td>87</td><td>113</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="tab is-hidden">
              <h4 class="tab-title subtitle is-4 is-size-5-mobile is-hidden">By Age</h4>
              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      <th><abbr title="Age"><span>Age</span></abbr></th>
                      <th><abbr title="Beginner"><span>Beg.</span></abbr></th>
                      <th><abbr title="Novice"><span>Nov.</span></abbr></th>
                      <th><abbr title="Intermediate"><span>Int.</span></abbr></th>
                      <th><abbr title="Advanced"><span>Adv.</span></abbr></th>
                      <th><abbr title="Elite"><span>Elite</span></abbr></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>20</td><td>46</td><td>68</td><td>96</td><td>129</td><td>164</td></tr>
                    <tr><td>25</td><td>47</td><td>70</td><td>98</td><td>132</td><td>169</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="section-box">
          <h2 class="title">Female Bench Press Standards (kg)</h2>
          <div class="tabs-container">
            <div class="tab">
              <table>
                <thead><tr><th>Strength Level</th><th>Weight</th></tr></thead>
                <tbody>
                  <tr><td>Beginner</td><td>17 kg</td></tr>
                  <tr><td>Novice</td><td>31 kg</td></tr>
                </tbody>
              </table>
            </div>
            <div class="tab is-hidden">
              <table>
                <thead><tr><th>Strength Level</th><th>Bodyweight Ratio</th></tr></thead>
                <tbody>
                  <tr><td>Beginner</td><td>0.25x</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <h3>By Weight and Age</h3>
          <div class="tabs-container block" data-tab-group="By Weight and Age">
            <div class="tab">
              <h4 class="tab-title subtitle is-4 is-size-5-mobile is-hidden">By Bodyweight</h4>
              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      <th><abbr title="Bodyweight"><span>BW</span></abbr></th>
                      <th><abbr title="Beginner"><span>Beg.</span></abbr></th>
                      <th><abbr title="Novice"><span>Nov.</span></abbr></th>
                      <th><abbr title="Intermediate"><span>Int.</span></abbr></th>
                      <th><abbr title="Advanced"><span>Adv.</span></abbr></th>
                      <th><abbr title="Elite"><span>Elite</span></abbr></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>45</td><td>10</td><td>19</td><td>33</td><td>49</td><td>67</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="tab is-hidden">
              <h4 class="tab-title subtitle is-4 is-size-5-mobile is-hidden">By Age</h4>
              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      <th><abbr title="Age"><span>Age</span></abbr></th>
                      <th><abbr title="Beginner"><span>Beg.</span></abbr></th>
                      <th><abbr title="Novice"><span>Nov.</span></abbr></th>
                      <th><abbr title="Intermediate"><span>Int.</span></abbr></th>
                      <th><abbr title="Advanced"><span>Adv.</span></abbr></th>
                      <th><abbr title="Elite"><span>Elite</span></abbr></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>20</td><td>17</td><td>31</td><td>51</td><td>74</td><td>101</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
    `;

    const parsed = parseExerciseStandardsHtml(html);

    expect(parsed.exerciseName).toBe("Bench Press");
    expect(parsed.male[0]).toEqual({ level: "Beginner", value: "47 kg" });
    expect(parsed.female[1]).toEqual({ level: "Novice", value: "31 kg" });
    expect(parsed.maleBodyweightRatio[0]).toEqual({ level: "Beginner", value: "0.50x" });
    expect(parsed.femaleBodyweightRatio[0]).toEqual({ level: "Beginner", value: "0.25x" });
    expect(parsed.maleByBodyweight[0]).toEqual({
      label: "50",
      beginner: "24",
      novice: "38",
      intermediate: "57",
      advanced: "79",
      elite: "103",
    });
    expect(parsed.maleByAge[1]).toEqual({
      label: "25",
      beginner: "47",
      novice: "70",
      intermediate: "98",
      advanced: "132",
      elite: "169",
    });
    expect(parsed.femaleByBodyweight[0]).toEqual({
      label: "45",
      beginner: "10",
      novice: "19",
      intermediate: "33",
      advanced: "49",
      elite: "67",
    });
  });

  it("可以提取动作对比页摘要表", () => {
    const html = `
      <h2>Male Strength Standards (kg)</h2>
      <table>
        <thead><tr><th>Strength Level</th><th>Bench Press</th><th>Squat</th></tr></thead>
        <tbody>
          <tr><td>Beginner</td><td>47 kg</td><td>64 kg</td></tr>
        </tbody>
      </table>
      <h2>Female Strength Standards (kg)</h2>
      <table>
        <thead><tr><th>Strength Level</th><th>Bench Press</th><th>Squat</th></tr></thead>
        <tbody>
          <tr><td>Beginner</td><td>17 kg</td><td>30 kg</td></tr>
        </tbody>
      </table>
    `;

    expect(parseComparisonStandardsHtml(html, "bench-press-vs-squat")).toEqual({
      kind: "comparison",
      leftName: "Bench Press",
      rightName: "Squat",
      unit: "kg",
      male: [
        { level: "Beginner", leftValue: "47 kg", rightValue: "64 kg" },
      ],
      female: [
        { level: "Beginner", leftValue: "17 kg", rightValue: "30 kg" },
      ],
    });
  });

  it("可以解析真实页面里带 section-box 的对比页结构", () => {
    const html = `
      <div class="section-box">
        <h2 class="title">Male Strength Standards (kg)</h2>
        <div class="table-container">
          <table>
            <thead><tr><th>Strength Level</th><th>Bench Press</th><th>Squat</th></tr></thead>
            <tbody>
              <tr><td>Intermediate</td><td>98 kg</td><td>130 kg</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="section-box">
        <h2 class="title">Female Strength Standards (kg)</h2>
        <div class="table-container">
          <table>
            <thead><tr><th>Strength Level</th><th>Bench Press</th><th>Squat</th></tr></thead>
            <tbody>
              <tr><td>Intermediate</td><td>51 kg</td><td>73 kg</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    const parsed = parseComparisonStandardsHtml(html, "bench-press-vs-squat");

    expect(parsed.male[0]).toEqual({
      level: "Intermediate",
      leftValue: "98 kg",
      rightValue: "130 kg",
    });
    expect(parsed.female[0]).toEqual({
      level: "Intermediate",
      leftValue: "51 kg",
      rightValue: "73 kg",
    });
  });
});
