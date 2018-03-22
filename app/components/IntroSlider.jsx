import React, { Component } from "react";
import { translate } from "react-i18next";

import IntroSliderItem from "components/IntroSliderItem";

import "./IntroSlider.css";

class IntroSlider extends Component {
	constructor(props) {
    super(props);
    
    const gettingStarted = localStorage.getItem('gettingStarted') ? false : true;

		this.state = {
			step: 1,
			skip: false,
			show: gettingStarted
		};


		this.changeStep = this.changeStep.bind(this);
	}

	changeStep(step) {
		const prevStep = this.state.step;
		if (step === "next") {
			this.setState({
				step: prevStep + 1
			});
		} else if (step === "prev") {
			this.setState({
				step: prevStep - 1
			});
		} else {
      localStorage.setItem("gettingStarted", false);
      this.setState({
				show: false
			});
		}
	}

	render() {
		const { item } = this.props;

		const steps = [
			{ img: "inicio", title: "¿QUÉ ES EL MAPA?", text: "" },
			{
				img: "que-es-el-mapa",
				title: "",
				text: "El mapa es una herramienta interactiva"
			},
			{
				img: "topicos-indicadores",
				title: "",
				text:
					"que agrupa información derivada del sitio datachile.io a través de Tópicos e Indicadores"
			},
			{
				img: "tooltip",
				title: "",
				text:
					"pudiendo hacer cruces de datos y pintando esta información sobre el mapa"
			},
			{
				img: "anadir-data",
				title: "",
				text:
					"Además el mapa integra la opción “CARRITO”: recurso que permite añadir conjuntos de datos seleccionados a un carro virtual y descargarlos para su uso."
			},
			{
				img: "descargar",
				title: "",
				text:
					"Los datos se presentan en una tabla organizada que distribuye el contenido ya sea en columnas o filas. Con solo un clic es posible descargar un archivo en formato CSV ordenado y fácil de usar."
			},
			{ img: "empezar-a-explorar", title: "COMIENZA A EXPLORAR", text: "" }
		];

		if (this.state.show)
			return (
				<div>
					<div className="overlay" />
					{steps.map((item, key) => {
						return (
							<IntroSliderItem
								currentStep={this.state.step}
								step={key + 1}
								total={steps.length}
								img={item.img}
								title={item.title}
								text={item.text}
								onClick={this.changeStep}
							/>
						);
					})}
				</div>
			);
		else return <div />;
	}
}

export default translate()(IntroSlider);
