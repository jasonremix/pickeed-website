import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Avatar, Badge, Button, buttonClasses, Card, initials, Skeleton, Spinner, TextField } from "../src";

describe("Button", () => {
  it("ist standardmässig ein type=button und löst Klicks aus", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Speichern</Button>);
    const button = screen.getByRole("button", { name: "Speichern" });
    expect(button).toHaveAttribute("type", "button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("sperrt sich beim Laden und meldet «beschäftigt»", async () => {
    const onClick = vi.fn();
    render(
      <Button loading loadingLabel="Wird gespeichert" onClick={onClick}>
        Speichern
      </Button>,
    );
    const button = screen.getByRole("button", { name: /Speichern/ });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Wird gespeichert");
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("liefert Klassen je Variante und Grösse", () => {
    expect(buttonClasses({ variant: "primary" })).toContain("bg-gradient-action");
    expect(buttonClasses({ variant: "danger" })).toContain("bg-danger");
    expect(buttonClasses({ size: "lg", fullWidth: true })).toMatch(/h-13.*w-full|w-full.*h-13/);
  });
});

describe("TextField", () => {
  it("verknüpft Label, Hinweis und Fehler zugänglich", () => {
    render(
      <TextField label="E-Mail" hint="Wir schicken dir einen Code." error="Ungültige Adresse" required />,
    );
    const input = screen.getByLabelText(/E-Mail/);
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Ungültige Adresse Wir schicken dir einen Code.");
  });

  it("setzt ohne Fehler kein aria-invalid", () => {
    render(<TextField label="Name" />);
    expect(screen.getByLabelText("Name")).not.toHaveAttribute("aria-invalid");
  });

  it("nimmt Eingaben an", async () => {
    render(<TextField label="Name" />);
    const input = screen.getByLabelText("Name");
    await userEvent.type(input, "Lea");
    expect(input).toHaveValue("Lea");
  });
});

describe("Avatar", () => {
  it("bildet Initialen aus Vor- und Nachnamen", () => {
    expect(initials("Lea Muster")).toBe("LM");
    expect(initials("  noah  ")).toBe("N");
    expect(initials("Anna Maria von Arx")).toBe("AA");
  });

  it("zeigt ohne Bild Initialen mit zugänglichem Namen", () => {
    render(<Avatar name="Lea Muster" />);
    expect(screen.getByRole("img", { name: "Lea Muster" })).toHaveTextContent("LM");
  });

  it("zeigt ein Bild mit Alt-Text und das Verifiziert-Häkchen", () => {
    render(<Avatar name="Bergquell" src="/a.jpg" verifiedLabel="Verifiziert" />);
    expect(screen.getByRole("img", { name: "Bergquell" })).toHaveAttribute("src", "/a.jpg");
    expect(screen.getByText("Verifiziert")).toHaveClass("sr-only");
  });
});

describe("Weitere Komponenten", () => {
  it("Badge rendert Inhalt", () => {
    render(<Badge tone="primary">Neu</Badge>);
    expect(screen.getByText("Neu")).toHaveClass("bg-primary-soft");
  });

  it("Spinner ohne Label ist dekorativ, mit Label ein Status", () => {
    const { container, rerender } = render(<Spinner />);
    expect(screen.queryByRole("status")).toBeNull();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    rerender(<Spinner label="Lädt" />);
    expect(screen.getByRole("status")).toHaveTextContent("Lädt");
  });

  it("Skeleton ist für Screenreader verborgen", () => {
    const { container } = render(<Skeleton shape="circle" />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("Card übernimmt Attribute", () => {
    render(<Card data-testid="karte" variant="raised" />);
    expect(screen.getByTestId("karte")).toHaveClass("shadow-2");
  });
});
