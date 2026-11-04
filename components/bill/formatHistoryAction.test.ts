import { formatHistoryAction } from "./formatHistoryAction"

describe("formatHistoryAction", () => {
  it("leaves plain actions unchanged", () => {
    expect(
      formatHistoryAction("Referred to the committee on Ways and Means")
    ).toBe("Referred to the committee on Ways and Means")
  })

  it("strips the markup the legislature embeds in hearing updates", () => {
    expect(
      formatHistoryAction(
        'Hearing rescheduled to 11/25/2025 from 10:00 AM-04:00 PM in A-2 and Virtual<br> <span style="color: blue; font-style: italic;">Hearing updated to New End Time</span>'
      )
    ).toBe(
      "Hearing rescheduled to 11/25/2025 from 10:00 AM-04:00 PM in A-2 and Virtual\nHearing updated to New End Time"
    )
  })

  it("handles self-closing and uppercase line breaks", () => {
    expect(formatHistoryAction("First<br/>Second<BR />Third")).toBe(
      "First\nSecond\nThird"
    )
  })

  it("decodes common HTML entities", () => {
    expect(
      formatHistoryAction("Ways &amp; Means&nbsp;&#8211; &lt;H1&gt;")
    ).toBe("Ways & Means – <H1>")
  })

  it("keeps text that only looks like a comparison", () => {
    expect(formatHistoryAction("Vote 3 < 5 and 7 > 2")).toBe(
      "Vote 3 < 5 and 7 > 2"
    )
  })
})
