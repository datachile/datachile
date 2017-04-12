import React from "react";
import "./FeaturedBox.css";
import { FORMATTERS } from "helpers/formatters";

export default function FeaturedBox(props) {
  return (
    <a key={props.item.key+'anchor'} className="tile" href={ props.item.url } style={{backgroundImage: `url('/images/profile-bg/${props.item.background}')`}}>
        <span className="tile-filter"></span>
        <span className="col-l">
	        <img className="icon" src="/images/icons/icon-location-profile.svg" />
	        <span className="name">{ props.item.name }</span>
        	<span className="region">{ FORMATTERS.roman((props.item.parent)?props.item.parent.key:props.item.key) }</span>
        </span>
        <span className="col-r">
        	<span className="type">{ props.item.type }</span>
        </span>
    </a>
  );
}
