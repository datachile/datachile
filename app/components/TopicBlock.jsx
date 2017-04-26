import React, {Component} from "react";
import {Link} from "react-router";
import "./TopicBlock.css";


class TopicBlock extends Component {

  render() {
    const {children, slug, name, targets} = this.props;
    return (
        <div className="topic-block" name={ slug } >
            <a className="topic-anchor" id={ slug }></a>
        	<div className="topic-header" style={{backgroundImage: `url('/images/profile-section-header/${slug}.png')`}}>
        		<div className="dc-container">
        			<div className="topic-name">{ name}</div>
        			<div className="topic-go-to">
        				<div className="topic-go-to-txt">Jump to:</div>
        				<div className="topic-go-to-targets">
        					{
				                targets.map(t =>
        							<Link key={t[1]} href={ '#' + t[1] }>{ t[0] }</Link>
				                )
				            }
        				</div>
        			</div>
        		</div>
        	</div>
        	<div className="dc-container">
        		{ children }
        	</div>
        </div>
    );
  }

}

export default TopicBlock;
export {TopicBlock};
