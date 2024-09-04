import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://rosiebaek.site",
  author: "rosie",
  profile: "https://github.com/eunmmm",
  desc: "개발 블로그 입니다.",
  title: "rosieBlog",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 3,
  scheduledPostMargin: 15 * 60 * 1000,
};

export const LOCALE = {
  lang: "ko",
  langTag: ["ko-KR"],
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/eunmmm",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:rosiebaek223@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
];
