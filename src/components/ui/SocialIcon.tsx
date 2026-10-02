import { GraduationCap } from "lucide-react";
import type { SocialId } from "@/lib/site";
import {
  DiscordIcon,
  GithubIcon,
  RedditIcon,
  XIcon,
  YoutubeIcon,
} from "./BrandIcons";

/**
 * One place mapping a social account to its mark, so the nav menu and the
 * footer can never drift apart.
 *
 * Skool has no simple-icons entry and their CDN blocks automated fetches,
 * so it uses a lucide GraduationCap rather than a bad freehand copy of
 * someone's trademark.
 */
const ICONS: Record<
  SocialId,
  (props: { className?: string; width?: number; height?: number }) => React.ReactNode
> = {
  discord: DiscordIcon,
  github: GithubIcon,
  reddit: RedditIcon,
  x: XIcon,
  youtube: YoutubeIcon,
  skool: (props) => <GraduationCap aria-hidden="true" {...props} />,
};

export function SocialIcon({
  id,
  className = "h-4 w-4",
}: {
  id: SocialId;
  className?: string;
}) {
  const Icon = ICONS[id];
  return <Icon className={className} />;
}
