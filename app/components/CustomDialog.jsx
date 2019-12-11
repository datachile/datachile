import React from "react";
import { withNamespaces } from "react-i18next";

import { Button, Dialog, Intent } from "@blueprintjs/core";

import ReactTable from "react-table";

import "../../node_modules/react-table/react-table.css";
import "./CustomDialog.css";

class CustomDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.toggleDialog = this.toggleDialog.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      isOpen: newProps.isOpen || this.state.isOpen
    });
  }

  toggleDialog() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    let { dialogHeader, dialogBody, className, t } = this.props;
    //dialogBody = dialogBody.sort();

    const flattenedData = Object.keys(dialogBody).map(item => {
      let entity = dialogBody[item];
      return {
        ...entity
      };
    });
    const columns = [
      {
        Header: t("School"),
        accessor: "school",
        minWidth: 270
      },
      {
        Header: t("Efectiveness"),
        accessor: "efectiveness",
        maxWidth: 80,
        className: "text-center"
      },
      {
        Header: t("Fairness"),
        accessor: "fairness",
        maxWidth: 80,
        className: "text-center"
      },
      {
        Header: t("Improvement"),
        accessor: "improvement",
        maxWidth: 80,
        className: "text-center"
      },
      {
        Header: t("Initiative"),
        accessor: "initiative",
        maxWidth: 80,
        className: "text-center"
      },
      {
        Header: t("Integration"),
        accessor: "integration",
        maxWidth: 80,
        className: "text-center"
      },
      {
        Header: t("Overcoming"),
        accessor: "overcoming",
        maxWidth: 80,
        className: "text-center"
      },
      {
        Header: t("Sned_score"),
        accessor: "sned_score",
        maxWidth: 80,
        className: "text-center"
      }
    ];

    return (
      <div className="custom-dialog-sned">
        <Dialog
          icon="inbox"
          isOpen={this.state.isOpen}
          onClose={this.toggleDialog}
          title={dialogHeader}
          className={`${className} custom-dialog-sned`}
        >
          <div className="bp3-dialog-body">
            <ReactTable
              className="table"
              data={flattenedData}
              columns={columns}
              pageSizeOptions={[20, 25, 50, 100]}
              defaultPageSize={
                flattenedData.length < 20 ? flattenedData.length : 20
              }
              style={{
                height: "70vh"
              }}
              previousText={t("table.prev")}
              nextText={t("table.next")}
              loadingText={t("table.loading")}
              noDataText={t("table.no_data")}
              pageText={t("table.page")}
              ofText={t("table.of")}
              rowsText={t("table.rows")}
            />
          </div>
        </Dialog>
      </div>
    );
  }
}

export default withNamespaces()(CustomDialog);
