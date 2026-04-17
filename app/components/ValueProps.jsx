import { SplitSection } from "./SplitSection";
import { StackedSection } from "./StackedSection";

export function ValueProps({ items = [] }) {
  return (
    <>
      {items.map((item, i) => {
        if (item.layout === "stacked") {
          return (
            <StackedSection
              key={i}
              eyebrow={item.eyebrow}
              heading={item.heading}
              body={item.body}
              visual={item.visual}
            />
          );
        }
        return (
          <SplitSection
            key={i}
            orientation={item.orientation}
            eyebrow={item.eyebrow}
            heading={item.heading}
            body={item.body}
            visual={item.visual}
          />
        );
      })}
    </>
  );
}
