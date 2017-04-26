import React, {Component} from "react";
import {Link} from "react-router";
import {translate} from "react-i18next";

import ExportsByProduct from './foreign-trade/ExportsByProduct';
import ExportsByDestination from './foreign-trade/ExportsByDestination';
import ImportsByOrigin from './foreign-trade/ImportsByOrigin';
import TradeBalance from './foreign-trade/TradeBalance';

class ForeingTrade extends Component {

  /*static need = [
    ExportsByProduct,
    ExportsByDestination,
    ImportsByOrigin,
    TradeBalance
  ];*/

  render() {
    const {t} = this.props;

    return (
        <div className="sub-topic-block" name="ForeignTrade">
            <a className="sub-topic-anchor" id="ForeignTrade"></a>
            <div className="dc-container">
                
                <div className="sub-topic-header">

                    <div className="sub-topic-title">
                        <div className="sub-topic-parent">{ t('Economy') }</div>
                        <div className="sub-topic-name">{ t('Foreign Trade') }</div>
                    </div>
                    <div className="sub-topic-go-to-targets">
                        <Link href="#ExportsByProduct">{ t('Exports By Product') }</Link>
                        <Link href="#ExportsByDestination">{ t('Exports By Destination') }</Link>
                        <Link href="#ImportsByOrigin">{ t('Imports By Origin') }</Link>
                        <Link href="#TradeBalance">{ t('Trade Balance') }</Link>
                    </div>
                    <div className="sub-topic-text">
                        Aliquam erat volutpat. Nunc eleifend leo vitae magna. In id erat non orci commodo lobortis. Proin neque massa, cursus ut, gravida ut, lobortis eget, lacus. Sed diam. Praesent fermentum tempor tellus. Nullam tempus. Mauris ac felis vel velit tristique imperdiet. Donec at pede. Etiam vel neque nec dui dignissim bibendum. Vivamus id enim. Phasellus neque orci, porta a, aliquet quis, semper a, massa. Phasellus purus. Pellentesque tristique imperdiet tortor. Nam euismod tellus id erat.
                    </div>

                </div>
            
                <ExportsByProduct />
                <ExportsByDestination />
                <ImportsByOrigin />
                <TradeBalance />
            </div>
        </div>
    );
  }
}

export default translate()(ForeingTrade);
