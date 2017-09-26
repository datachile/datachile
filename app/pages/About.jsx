import React, {Component} from "react";
import {CanonComponent,TopicTitle} from "datawheel-canon";

import Nav from "components/Nav";
import "./About.css";

import {GLOSSARY} from "helpers/glossary";
import {titleCase} from "d3plus-text";

const topics = [
  {
    slug: "background",
    title: "Background"
  },
  {
    slug: "data",
    title: "Data Sources"
  },
  {
    slug: "glossary",
    title: "Glossary"
  },
  {
    slug: "terms",
    title: "Terms of Use"
  }
];

class About extends Component {

  constructor() {
    super();
    this.state = {
      activeSub: false,
      subnav: false
    };
  }

  componentDidMount() {
    //window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  handleScroll() {
    const {activeSub, subnav} = this.state;
    const newSub = this.refs.sublinks.getBoundingClientRect().top <= 0;
    let newActive = false;
    for (let i = 0; i < topics.length; i++) {
      const top = document.getElementById(topics[i].slug).getBoundingClientRect().top;
      if (top <= 0) newActive = topics[i].slug;
    }
    if (subnav !== newSub || newActive !== activeSub) {
      this.setState({activeSub: newActive, subnav: newSub});
    }
  }

  render() {
    const {activeSub, subnav} = this.state;
    return (
      <CanonComponent id="about" data={this.props.data} topics={[]}>
        <Nav />
        <div className="about">
          <div className="intro">
            <div className="splash">
              <div className="image"></div>
              <div className="gradient"></div>
            </div>
            <div className="header">
              <div className="meta">
                  <div className="title">About</div>
              </div>
            </div>
            <div ref="sublinks" className="sublinks">
              {
                topics.map(topic =>
                  <a key={ topic.slug } className="sublink" href={ `#${topic.slug}` }>
                    { topic.title }
                  </a>
                )
              }
            </div>
          </div>

          <TopicTitle slug="background">Background</TopicTitle>
          <section className="section">
            <p className="paragraph">
              Data Chile is ...ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p className="paragraph">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </section>

          <TopicTitle slug="data">Data Sources</TopicTitle>
          <section className="section">
            <p className="paragraph">
              The data contained in this site draws from a variety of sources,
              including:
            </p>
            <ul className="paragraph">
              <li><a href="http://dataset1" target="_blank">Dataset 1</a></li>
              <li><a href="http://dataset2" target="_blank">Dataset 2</a></li>
            </ul>
          </section>

          <TopicTitle slug="glossary">Glossary</TopicTitle>
          <section className="section glossary">
            {GLOSSARY.map(entry =>
              <div className="paragraph" key={entry.term} id={entry.term}>
                <p className="term">{entry.term === entry.term.toUpperCase() ? entry.term : titleCase(entry.term)}</p>
                <p className="definition">
                {entry.definition}
                </p>
              </div>
            )}
          </section>

          <TopicTitle slug="terms">Terms of Use</TopicTitle>
          <section className="section">
            <p className="paragraph">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
            </p>

            <p className="paragraph">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
            </p>

          </section>

        </div>
      </CanonComponent>
    );
  }
}

export default About;
