import { Font, SatoriOptions } from "satori";
import { FontConfig, SatoriRequest } from "./models";

async function loadFontFromGoogle({
  name,
  weight,
  style,
}: FontConfig): Promise<Font> {
  const url = new URL("https://fonts.googleapis.com/css2");
  url.searchParams.append(
    "family",
    `${encodeURIComponent(name)}:${
      style == "italic" ? "ital," : ""
    }wght@${weight}`
  );

  const css = await fetch(url, {
    headers: {
      // construct user agent to get TTF font
      "User-Agent":
        "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
    },
  }).then((res) => res.text());

  // Get the font URL from the CSS text
  const fontUrl = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  )?.[1];

  if (!fontUrl) {
    throw new Error("Could not find font URL");
  }

  const data = await fetch(fontUrl).then((res) => res.arrayBuffer());

  return {
    name,
    data,
    weight,
    style,
  };
}

export async function getSatoriOptions(
  req: SatoriRequest
): Promise<SatoriOptions> {
  const opt: SatoriOptions = {
    height: req.height,
    width: req.width,
    fonts: [],
  };

  const reqFonts = req.fonts ?? [
    {
      name: "Roboto",
      weight: 400,
      style: "normal",
    },
  ];

  for (const f of reqFonts) {
    opt.fonts.push(await loadFontFromGoogle(f));
  }

  return opt;
}
