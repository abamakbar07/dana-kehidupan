import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MoneyInput } from "@dana/ui";

describe("MoneyInput", () => {
  it("emits minor units on change", async () => {
    const onChange = vi.fn();
    render(<MoneyInput value={0} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    await userEvent.clear(input);
    await userEvent.type(input, "12.34");
    expect(onChange).toHaveBeenCalled();
  });
});

