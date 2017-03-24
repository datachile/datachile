import React from "react";
import {connect} from "react-redux";
import "./FeaturedBox.css";


export default function FeaturedBox(props) {
  return (
    <a key={props.item.key} className="tile" href={ `/geo/${props.item.slug}` } style={{backgroundImage: `url('/images/profile-bg/${props.item.slug}.jpg')`}}>
        <span className="name">{ props.item.name }</span>
    </a>
  );
}
