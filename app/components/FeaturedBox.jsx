import React from "react";
import {connect} from "react-redux";
import "./FeaturedBox.css";


export default function FeaturedBox(props) {
  return (
    <a key={props.item.key+'anchor'} className="tile" href={ props.item.url } style={{backgroundImage: `url('/images/profile-bg/${props.item.background}')`}}>
        <span className="name">{ props.item.name }</span>
        <span className="type">{ props.item.type }</span>
    </a>
  );
}
