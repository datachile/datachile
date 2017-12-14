import React, { Component } from "react";
import { translate } from "react-i18next";
import { CanonComponent, TopicTitle } from "datawheel-canon";

import Nav from "components/Nav";
import "./About.css";

class About extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    //window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  render() {
    const { t } = this.props;
    const topics = [
      {
        slug: "background",
        title: t("Background")
      },
      {
        slug: "data",
        title: t("Data Sources")
      },
      {
        slug: "glossary",
        title: t("Glossary")
      },
      {
        slug: "teams",
        title: t("Teams")
      },
      {
        slug: "acknowledgement",
        title: t("Acknowledgement")
      },
      {
        slug: "terms",
        title: t("Terms of Use")
      }
    ];

    return (
      <CanonComponent id="about" data={this.props.data} topics={topics}>
        <Nav
          title={t("About")}
          typeTitle={t("Home")}
          type={false}
          exploreLink={"/"}
        />
        <div className="about">
          <div className="intro">
            <div className="splash">
              <div className="image" />
              <div className="gradient" />
            </div>
            <div className="sublinks">
              {topics.map(topic => (
                <a key={topic.slug} className="sublink" href={`#${topic.slug}`}>
                  {topic.title}
                </a>
              ))}
            </div>
          </div>

          <section className="section">
            <TopicTitle slug="background">{t("Background")}</TopicTitle>
            <p className="paragraph">
              https://docs.google.com/document/d/1iMqwlteoYnR-r5H3JPBu5wSsUM8ncixSGK9YwR6hE3M/edit#
            </p>
          </section>
        </div>
      </CanonComponent>
    );
  }
}

export default translate()(About);
