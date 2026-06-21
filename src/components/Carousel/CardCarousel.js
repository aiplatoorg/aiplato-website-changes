import React from 'react';
import './Carousel.scss';
import { Row, Col, Carousel as BCarousel } from 'react-bootstrap';


export default class CardCarousel extends React.Component {
    state = {
        index: 0,
        arr1: [],
        arr2: [],
        loopRepeat: null
    }

    handleSelect = (selectedIndex, e) => {
        this.setState({ index: selectedIndex });
    };

    updateArr = () => {
        const imgInSlide = this.props.cardCount;
        const loopRepeat = Math.ceil(this.props.reviews.length / imgInSlide);
        this.setState({ loopRepeat: loopRepeat });

        let tempArr1 = [];
        let tempArr2 = [];
        for (let i = 0; i < loopRepeat; i++) {
            tempArr1.push(i);
        }

        for (let j = 0; j < imgInSlide; j++) {
            tempArr2.push(j);
        }
        this.setState({ arr2: tempArr2, arr1: tempArr1 })
    }

    componentWillMount() {
        this.revData = [...this.props.reviews];
        this.updateArr();
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.revData = [...this.props.reviews];
            this.updateArr();
        }
    }

    prev = () => {
        if (this.state.index - 1 >= 0) {
            this.setState((prevState) => ({ index: prevState.index - 1 }));
        }
    }

    next = () => {
        if (this.state.index + 1 < this.state.loopRepeat) {
            this.setState((prevState) => ({ index: prevState.index + 1 }));
        }
    }
    render() {

        const getCols = () => {
            let content = [];
            let curIndex = 0;

            for (let i in this.state.arr1) {
                let class_name = "carouselCol"
                let tempArr = [];

                for (let j in this.state.arr2) {
                    let popedItem = this.revData[curIndex++];
                    if (popedItem === undefined) {
                        continue;
                    }

                    if (j === "0" && parseInt(i) < parseInt(this.state.arr1.length - 1)) {
                        class_name = "carouselCol borderright"
                    }
                    else if (j === "0" && parseInt(i) === parseInt(this.state.arr1.length - 1)) {
                        class_name = "carouselCol"
                    }
                    else {
                        class_name = "carouselCol"
                    }
                    tempArr.push(
                        <>
                            <div className='studentBox' >
                                <img aria-label='' height={60} alt='Home Carousel' src={popedItem.image}></img>
                                <h6 style={{paddingTop:'10px'}}>{popedItem.name}</h6>
                                <p>                                   
                                {popedItem.text}
                                </p>
                            </div>

                        </>
                    )
                }
                content.push(tempArr);
            }
            return content;
        }

        return (
            <div className='right-video' style={{ height: "250px", width: "100%" }}>
                <Row>
                    <Col md={12} style={{ position: 'relative' }}>
                        <ol class="carousel-indicators" style={{ background: '#ffffff' }}>
                            <li class="active" onClick={this.prev}><div className='left'></div></li>
                            <li class="active" onClick={this.next}><div className='right'></div></li>
                        </ol>
                        <div className='carousel-container' >
                            <BCarousel activeIndex={this.state.index} onSelect={this.handleSelect} indicators={false} interval={null}>
                                {

                                    getCols().map((cols, ind) => (
                                        <BCarousel.Item key={'item_' + ind}>
                                            <Row key={'row_' + ind} style={{ margin: 0 }}>
                                                {cols.map((col) => col)}
                                            </Row>
                                        </BCarousel.Item>
                                    ))
                                }

                            </BCarousel>
                        </div>
                    </Col>
                </Row>

            </div >
        );
    }

}