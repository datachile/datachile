import React, {Component} from "react";
import "./SourceNote.css";


class SourceNote extends Component {

  render() {
    const {children, icon} = this.props;
    return (
        <div className="source-note">
            <img className="source-note-img" src={ icon } />
            <div className="source-note-txt">
                { children }
            </div>
        </div>
    );
  }

}

SourceNote.defaultProps = {icon: ""};
export default SourceNote;
export {SourceNote};
