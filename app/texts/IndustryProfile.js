import { annualized_growth } from "helpers/calculator";
import { sources } from "helpers/consts";
import { numeral, slugifyItem } from "helpers/formatters";
import { getTopCategories } from "helpers/dataUtils";

export function Economy(data, locale) {
  if (data) {
    let output = {
      location: {
        first: {},
        second: {}
      }
    };
    const total = data.reduce((all, item) => {
      return all + item["Output"];
    }, 0);
    const rank = getTopCategories(data, "Output", 2);

    if (rank[0]) {
      output.location.first.caption = rank[0]["Comuna"];
      output.location.first.value = rank[0]["Output"];
      output.location.first.share = numeral(
        rank[0]["Output"] / total,
        locale
      ).format("0.0 %");
      output.location.first.link = slugifyItem(
        "geo",
        rank[0]["ID Region"],
        rank[0]["Region"],
        rank[0]["ID Comuna"],
        rank[0]["Comuna"]
      );
    }
    if (rank[1]) {
      output.location.second.caption = rank[1]["Comuna"];
      output.location.second.value = rank[1]["Output"];
      output.location.second.share = numeral(
        rank[1]["Output"] / total,
        locale
      ).format("0.0 %");
      output.location.second.link = slugifyItem(
        "geo",
        rank[1]["ID Region"],
        rank[1]["Region"],
        rank[1]["ID Comuna"],
        rank[1]["Comuna"]
      );
    }

    return output;
  } else {
    return false;
  }
}
