import Image from "next/image";

import styles from "./SectionHeader.module.css";

type Props = {
  avatar: string;
  label: string;
  mode?: "fixed" | "panel";
};

export default function SectionHeader({
  avatar,
  label,
  mode = "panel",
}: Props) {
  return (
    <div
      className={styles.header}
      data-label={label}
      data-mode={mode}
      aria-hidden
    >
      <span className={styles.badge}>
        <span className={styles.avatar}>
          <Image src={avatar} alt="" width={96} height={96} priority={mode === "fixed"} />
        </span>
        <span className={styles.label}>{label}</span>
      </span>
    </div>
  );
}
