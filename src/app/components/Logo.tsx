import logo from "../../imports/Logo_white_copy_3.png";

type LogoProps = {
  /** Rendered height in pixels. Width is derived from the lockup ratio. */
  height?: number;
  className?: string;
};

// The source PNG is a square canvas with generous transparent margins around a
// stacked lockup (diamond mark + MITODERM + tagline). We crop the margins with
// object-fit: cover inside a box sized to the lockup's content ratio (~2.9:1).
export function Logo({ height = 52, className = "" }: LogoProps) {
  return (
    <img
      src={logo}
      alt="Mitoderm — Where Science Meets Beauty"
      className={className}
      style={{
        height,
        width: height * 2.9,
        objectFit: "cover",
        objectPosition: "center",
      }}
    />
  );
}
