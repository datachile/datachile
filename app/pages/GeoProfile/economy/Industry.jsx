import React, {Component} from "react";
import {Link} from "react-router";
import {translate} from "react-i18next";

import OutputByIndustry from './industry/OutputByIndustry';

class Industry extends Component {

  /*static need = [
    OutputByIndustry
  ];*/

  render() {
    const {t} = this.props;

    return (
        <div className="sub-topic-block" name="Industry">
            <a className="sub-topic-anchor" id="Industry"></a>
            <div className="dc-container">
                
                <div className="sub-topic-header">

                    <div className="sub-topic-title">
                        <div className="sub-topic-parent">{ t('Economy') }</div>
                        <div className="sub-topic-name">{ t('Industry') }</div>
                    </div>
                    <div className="sub-topic-go-to-targets">
                        <Link href="#OutputByIndustry">{ t('Output By Industry') }</Link>
                    </div>
                    <div className="sub-topic-text">
                        Aliquam erat volutpat. Nunc eleifend leo vitae magna. In id erat non orci commodo lobortis. Proin neque massa, cursus ut, gravida ut, lobortis eget, lacus. Sed diam. Praesent fermentum tempor tellus. Nullam tempus. Mauris ac felis vel velit tristique imperdiet. Donec at pede. Etiam vel neque nec dui dignissim bibendum. Vivamus id enim. Phasellus neque orci, porta a, aliquet quis, semper a, massa. Phasellus purus. Pellentesque tristique imperdiet tortor. Nam euismod tellus id erat.
                    </div>

                </div>
            
                <OutputByIndustry/>

            </div>
        </div>
    );
  }
}

export default translate()(Industry)
