import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Row, Col, Button, ButtonToolbar,
         OverlayTrigger, Tooltip, Modal, FormGroup,
         FormControl, Panel, ProgressBar } from 'react-bootstrap'
import moment from 'moment'
import momentDurationFormat from 'moment-duration-format'
import FontAwesome from 'react-fontawesome'
import domtoimage from 'dom-to-image'
import { Sparklines, SparklinesLine } from 'react-sparklines'
import { REST_API_PREFIX } from '../constants/Constants'

import {  getLrnResult, getlookupResults } from '../actions/CdrConferenceActions'
import Lookup from './LookupComponents/Lookup'

class ExpandedCDRComponent extends React.Component {
	constructor( props ) {
		super(props);

        this.state = {
            showModal: false,
            lrnRequestState: false,
            participantsJSON: '',
            lrnData: {},
            expandView: {},
            lookupList: [],
            lrnList: []
        }

        this.handleCloseModal = this.handleCloseModal.bind(this);

        this.addNewLookup = this.addNewLookup.bind(this);
        this.removeLookup = this.removeLookup.bind(this);

        this.addNewLRNitem = this.addNewLRNitem.bind(this);
        this.removeLRNitem = this.removeLRNitem.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState){
	    console.log(this.state !== nextState);
	    return this.state.lookupList === nextState.lookupList;
    }

    getLRNData(callerNumber){
        let LRNurl = `http://ossui.star2star.net/oss-ui/rest/lrn/${callerNumber}`;

        this.setState({ lrnRequestState: true });

        axios.get(LRNurl).then( response => {
                this.setState({lrnRequestState: false, lrnList: []});

                this.addNewLRNitem(response.data, callerNumber);
            }).catch( error => {
               alert(error);
            });
    }

    lrnRequest(callerNumber){
        let callerCurrentNumber;
        let phoneNumber = callerNumber.indexOf('+') !== -1 ? callerNumber.replace(/\s/g,'').substring(1, callerNumber.length) 
                                                         : callerNumber.replace(/\s/g,'');

        if(+phoneNumber.length === 11){
            callerCurrentNumber = phoneNumber;
        }else if(+phoneNumber.length === 10){
            callerCurrentNumber = '1' + phoneNumber;
        }else{
            alert('The number is incorrect.') 
            callerCurrentNumber = null;
        }

        if(callerCurrentNumber !== null){
            this.getLRNData(callerCurrentNumber);
        }
    }

    getLookupData(ip){
        console.log('getLookupData');
        this.props.dispatch(getlookupResults(ip)).then(responce => {
            if(responce.error){
                alert(responce.payload);
            }else{
                this.addNewLookup(responce, ip);
            }
        });
    }

    addNewLRNitem(lrnData, callerNumber){
        let newId = '',
        possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTYUVWXYZabcdefghigklmnopqrstuvwxyz0123456789',
        lrnList = this.state.lrnList,
        timestamp = moment.utc().unix();

        for(let i = 0; i < 4; i++){
            newId += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        }

        lrnList.push({
            id: newId,
            callerNumber: callerNumber,
            lrnData: lrnData,
        });

        this.setState({lrnList: lrnList, lrnRequestState: false});
    }

    removeLRNitem(id) {
        let lrnList = this.state.lrnList;

        lrnList = lrnList.filter((lrn)=>{ return lrn.id !== id });

        this.setState({lrnList: lrnList});
    }

    addNewLookup(lookupData, ip){
        console.log('addNewLookup');
        let newId = '',
        possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTYUVWXYZabcdefghigklmnopqrstuvwxyz0123456789',
        lookupList = this.state.lookupList,
        timestamp = moment.utc().unix();

        for(let i = 0; i < 4; i++){
            newId += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        }
        lookupList.push({
            id: newId,
            lookupIp: ip,
            lookupData: lookupData,
        });

        this.setState({lookupList: lookupList});
    }

    removeLookup(id) {
        let lookupList = this.state.lookupList;

        lookupList = lookupList.filter((lookup)=>{ return lookup.id !== id });

        this.setState({lookupList: lookupList});
    }

    saveResultAsImage(callId) {
        let resultElement = document.getElementById(`cdr-details-${ callId }`);

        domtoimage.toPng(resultElement).then( dataUrl => {
            var link = document.createElement('a');
            
            link.download = `Result_screen_${callId}.png`;
            link.href = dataUrl;
            link.click();
        });
    }

    saveTableResultAsImage(tableId){
        let resultElement = document.getElementById(`conf-details-div-${tableId}`);

        domtoimage.toPng(resultElement).then( dataUrl => {
            var link = document.createElement('a');
            
            link.download = `Result_table_screen_${tableId}.png`;
            link.href = dataUrl;
            link.click();
        });   
    }

    expandableConfRow(rows){
        return !!rows;
    }

    expandedConfController(rows){
        let expandView = Object.assign({}, this.state.expandView);

        expandView[rows.callId] = ! expandView[rows.callId];
        this.setState({ expandView });
    }

    openCallerJSON(json){
        this.setState({
            showModal: !this.state.showModal,
            participantsJSON: JSON.stringify(json, undefined, 4)
        });
    }

    handleCloseModal(){
        this.setState({
            showModal: !this.state.showModal,
            participantsJSON: ''
        });
    }

    expandedConfComponent(tableData, rows){
	    console.log('expandedConfComponent');
	    return (
            <Col id={`cdr-details-${ rows.callId }`}>
                <Row>
                    <Col md={12}>
                        <Col className="box box-default box-solid">
                            <Col className="box-header">
                                <h3 className="box-title">Call Info</h3>
                            </Col>
                            <Col className="box-body">
                                 <Row>
                                    <Col md={4}>
                                        <dl className='dl-horizontal'>
                                            <div>
                                                <dt>Call ID:</dt>
                                                <dd><span onClick={this.openCallerJSON.bind(this, rows)} className="action-value">{ rows.conferenceId }</span></dd>
                                            </div>
                                            <div>
                                                <dt>Duration:</dt>
                                                <dd>{ rows.duration } ({moment.duration(+rows.duration, 'seconds').format('m [minutes] s [seconds]')})</dd>
                                            </div>
                                        </dl>
                                    </Col>
                                    <Col md={4}>
                                        <dl className='dl-horizontal'>
                                            <div>
                                                <dt>Caller Name:</dt>
                                                <dd>{ rows.callerName }</dd>
                                            </div>
                                             <div>
                                                <dt>Start:</dt>
                                                <dd>{ moment.unix(rows.start).format('YYYY-MM-DD hh:mm:ss') }</dd>
                                            </div>
                                            <div>
                                                <dt>End:</dt>
                                                <dd>{ moment.unix(rows.end).format('YYYY-MM-DD hh:mm:ss') }</dd>
                                            </div>
                                        </dl>
                                    </Col>
                                    <Col md={4}>
                                        <dl className='dl-horizontal'>
                                            <div>
                                                <dt>Caller number:</dt>
                                                <dd><span onClick={this.lrnRequest.bind(this, rows.callerId)} className="action-value">{ rows.callerId }</span></dd>
                                            </div>
                                             <div>
                                                <dt>Called Late:</dt>
                                                <dd>{moment.unix(rows.start - tableData.start).format('m [minutes] s [seconds]')}</dd>
                                            </div>
                                            <div>
                                                <dt>Left Earlier:</dt>
                                                <dd>{moment.unix(tableData.end - rows.end).format('m [minutes] s [seconds]')}</dd>
                                            </div>
                                        </dl>
                                    </Col>
                                </Row>
                            </Col>
                        </Col>
                    </Col>
                </Row>

                <Row>
                    <Col md={7}>
                        <Col className="box box-default box-solid">
                            <Col className="box-header">
                                <h3 className="box-title">Media / Quality info</h3>
                            </Col>
                            <Col className="box-body">
                                <Row>
                                    <Col md={6}>
                                        <dl className='dl-horizontal'>
                                            <div>
                                                <dt>Codec string:</dt>
                                                <dd>{ rows.rtpLastAudioCodecString }</dd>
                                            </div>
                                            <div>
                                                <dt>Quality percentage:</dt>
                                                <dd>{ rows.rtpAudioInQualityPercentage }</dd>
                                            </div>
                                            <div>
                                                <dt>RTP in (packets/bytes):</dt>
                                                <dd>{ `${ rows.rtpAudioInMediaPacketCount }/${ rows.rtpAudioInMediaBytes }` }</dd>
                                            </div>
                                            <div>
                                                <dt>Total flaws:</dt>
                                                <dd>{ rows.rtpAudioInFlawTotal }</dd>
                                            </div>
                                        </dl>
                                    </Col>
                                     <Col md={6}>
                                        <dl className='dl-horizontal'>
                                            <div>
                                                <dt>Local media:</dt>
                                                <dd><span onClick={this.getLookupData.bind(this, rows.localMediaIp)} className="action-value">{ rows.localMediaIp }</span> :{ rows.localMediaPort }</dd>
                                            </div>
                                            <div>
                                                <dt>Remote media:</dt>
                                                <dd><span onClick={this.getLookupData.bind(this, rows.remoteMediaIp)} className="action-value">{ rows.remoteMediaIp }</span>:{ rows.remoteMediaPort }</dd>
                                            </div>
                                            <div>
                                                <dt>MOS score:</dt>
                                                <dd>{ rows.rtpAudioInMos }</dd>
                                            </div>
                                            <div>
                                                <dt>RTP out (packets/bytes):</dt>
                                                <dd>{ `${ rows.rtpAudioOutMediaPacketCount }/${ rows.rtpAudioOutMediaBytes }` }</dd>
                                            </div>
                                            <div>
                                                <dt>Packet mean interval:</dt>
                                                <dd>{ rows.rtpAudioInMeanInterval }</dd>
                                            </div>
                                        </dl>
                                    </Col>
                                </Row>
                            </Col>
                        </Col>
                    </Col>

                    <Col md={5}>
                        <Col className="box box-default box-solid">
                            <Col className="box-header">
                                <h3 className="box-title">Advanced stats</h3>
                            </Col>
                            <Col className="box-body">
                                 <Row>
                                    <Col md={6}>
                                        <dl className='dl-horizontal'>
                                            <div>
                                                <dt>DTMF packets (in):</dt>
                                                <dd>{ rows.rtpAudioInDtmfPacketCount }</dd>
                                            </div>
                                            <div>
                                                <dt>Flush packets:</dt>
                                                <dd>{ rows.rtpAudioInFlushPacketCount }</dd>
                                            </div>
                                             <div>
                                                <dt>Largest JB size:</dt>
                                                <dd>{ rows.rtpAudioInLargestJbSize }</dd>
                                            </div>
                                             <div>
                                                <dt>Jitter max variance:</dt>
                                                <dd>{ rows.rtpAudioInJitterMaxVariance }</dd>
                                            </div>
                                             <div>
                                                <dt>Jitter burst rate:</dt>
                                                <dd>{ rows.rtpAudioInJitterBurstRate }</dd>
                                            </div>
                                        </dl>
                                    </Col>
                                    <Col md={6}>
                                        <dl className='dl-horizontal'>
                                            <div>
                                                <dt>CNG packets (in):</dt>
                                                <dd>{ rows.rtpAudioInCngPacketCount  }</dd>
                                            </div>
                                            <div>
                                                <dt>Jitter packets:</dt>
                                                <dd>{ rows.rtpAudioInJitterPacketCount }</dd>
                                            </div>
                                             <div>
                                                <dt>Jitter min variance:</dt>
                                                <dd>{ rows.rtpAudioInJitterMinVariance }</dd>
                                            </div>
                                             <div>
                                                <dt>Jitter loss rate:</dt>
                                                <dd>{ rows.rtpAudioInJitterLossRate }</dd>
                                            </div>
                                        </dl>
                                    </Col>
                                </Row>
                            </Col>
                        </Col>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                       {  this.props.cdr.getIn(['lookup', 'isFetching']) ?
                            <Panel bsStyle="success">
                                <div className=' spinner-block'>
                                    <FontAwesome className="fa-spin" name="spinner" />
                                </div>
                            </Panel> : this.state.lookupList.length > 0 ? this.renderLookup() : null }
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                       {  this.state.lrnRequestState ? 
                            <Panel bsStyle="success">
                                <div className=' spinner-block'>
                                    <FontAwesome className="fa-spin" name="spinner" />
                                </div>
                            </Panel> : this.state.lrnList.length > 0 ? this.renderLRN() : null }
                    </Col>
                </Row>
                <Row>
                    <Col md={12} >
                        <Col className="box box-default box-solid">
                            <Col className="box-body">
                                <Row>
                                    <Col md={12}>
                                        <ButtonToolbar>
                                            <Button onClick={ this.saveResultAsImage.bind(this, rows.callId) } id="take-screenshot"><FontAwesome name="camera" />  Make screenshot</Button>
                                        </ButtonToolbar>
                                    </Col>
                                </Row>
                            </Col>
                        </Col>
                    </Col>
                </Row>
            </Col>
        )
    }

    renderLookup(){
        console.log('renderLookup');
	    return this.state.lookupList.map(item =>{
            let lookupData = item.lookupData.payload.net;
            let testResultPanelHeader = (
                <div>
                    <span className="header-exp">Who Is lookup results - {item.lookupIp}</span>
                    <a href="javascript:void(0);" onClick={ () => this.removeLookup(item.id) }><FontAwesome className="expanded-icon pull-right" name="close" /></a>
                </div>
            );

            return(
                <Panel bsStyle="success" header={testResultPanelHeader} key={item.id} id={item.id}>
                    <Col md={4}>
                        <dl className='dl-horizontal'>
                            <div>
                                <dt>Net Range:</dt>
                                <dd>{`${lookupData.startAddress ? lookupData.startAddress['$'] : ''} - ${lookupData.endAddress ? lookupData.endAddress['$'] : ''}`}</dd>
                            </div>
                            <div>
                                <dt>Handle:</dt>
                                <dd>{ lookupData.handle ? lookupData.handle['$'] : '-' }</dd>
                            </div>
                            <div>
                                <dt>Origin AS:</dt>
                                <dd>{ lookupData.originASes ? lookupData.originASes.originAS['$'] : '-' }</dd>
                            </div>
                            <div>
                                <dt>Registration Date:</dt>
                                <dd>{ lookupData.registrationDate ? lookupData.registrationDate['$'] : '-' }</dd>
                            </div>
                        </dl>
                    </Col>
                    <Col md={4}>
                        <dl className='dl-horizontal'>
                            <div>
                                <dt>CIDR:</dt>
                                <dd>{ `${lookupData.netBlocks ? lookupData.netBlocks.netBlock.startAddress['$'] : '-'}/${lookupData.netBlocks ? lookupData.netBlocks.netBlock.cidrLength['$'] : '-'}`  }</dd>
                            </div>
                            <div>
                                <dt>Parent:</dt>
                                <dd>{ lookupData.parentNetRef ? lookupData.parentNetRef['@name'] : '-' }</dd>
                            </div>
                            <div>
                                <dt>Organization:</dt>
                                <dd>{ lookupData.orgRef ? lookupData.orgRef['@name'] : '-' }</dd>
                            </div>
                            <div>
                                <dt>Last Updated:</dt>
                                <dd>{ lookupData.updateDate ? lookupData.updateDate['$'] : '-' }</dd>
                            </div>
                        </dl>
                    </Col>
                    <Col md={4}>
                        <dl className='dl-horizontal'>
                            <div>
                                <dt>Name:</dt>
                                <dd>{ lookupData.name ? lookupData.name['$'] : '-' }</dd>
                            </div>
                            <div>
                                <dt>Net Type:</dt>
                                <dd>{ lookupData.netBlocks ? lookupData.netBlocks.netBlock.description['$'] : '-' }</dd>
                            </div>
                        </dl>
                    </Col>
                </Panel>
            );
        });
    }

    renderLRN(){
        return this.state.lrnList.map(item =>{
            let lrnData = item.lrnData;
            let testResultPanelHeader = (
                <div>
                    <span className="header-exp">Caller number - {item.callerNumber}</span>
                    <a href="javascript:void(0);" onClick={ () => this.removeLRNitem(item.id) }><FontAwesome className="expanded-icon pull-right" name="close" /></a>
                </div>
            );

            return(
                <Panel bsStyle="success" header={testResultPanelHeader} key={item.id} id={item.id}>
                    <Col md={4}>
                        <dl className='dl-horizontal'>
                            <dt>LRN:</dt>
                            <dd>{ lrnData.LRN ? lrnData.LRN : '-' }</dd>
                            <dt>Ported:</dt>
                            <dd>{ lrnData.LRN === item.callerNumber ? 'false' : 'true'  }</dd>
                            <dt>OCN:</dt>
                            <dd>{ lrnData.OCN ? lrnData.OCN : '-' }</dd>
                            <dt>LATA:</dt>
                            <dd>{ lrnData.LATA ? lrnData.LATA : '-' }</dd>
                            <dt>LEC:</dt>
                            <dd>{ lrnData.LEC ? lrnData.LEC : '-' }</dd>
                        </dl>
                    </Col>
                    <Col md={4}>
                        <dl className='dl-horizontal'>
                            <dt>State:</dt>
                            <dd>{ lrnData.STATE ? lrnData.STATE : '-' }</dd>
                            <dt>City:</dt>
                            <dd>{ lrnData.CITY ? lrnData.CITY : '-' }</dd>
                            <dt>Jurisdition:</dt>
                            <dd>{ lrnData.JURISDICTION ? lrnData.JURISDICTION : '-' }</dd>
                            <dt>Line Type:</dt>
                            <dd>{ lrnData.LINETYPE ? lrnData.LINETYPE : '-' }</dd>
                            <dt>DNC:</dt>
                            <dd>{ lrnData.DNC ? lrnData.DNC : '-' }</dd>
                        </dl>
                    </Col>
                </Panel>
            );
        });
    }

    renderWaitingScreenExpanded(){
        return (
            <Row>
                <Col md={12}>No data available in table</Col>
            </Row>
        );
    }
   
    renderExpandedIcon(cell, rows){
        return (
            <Col>
                <FontAwesome id={rows.callId} name={ this.state.expandView[rows.callId] ? "chevron-circle-down" : "chevron-circle-right"} />
            </Col>
        );
    }

    renderRTPIn(cell, rows){
        return `${ rows.rtpAudioInMediaPacketCount }/${ rows.rtpAudioInMediaBytes }`;
    }

    renderRTPOut(cell, rows){
        return `${ rows.rtpAudioOutMediaPacketCount }/${ rows.rtpAudioOutMediaBytes }`;
    }

    renderStartEnd(data, cell, rows){
        const tooltip = ( 
            <Tooltip id="tooltip-description">
                <Col>
                    { `Start: ${moment.unix(rows.start).format('YYYY-MM-DD hh:mm:ss')}` }
                </Col>
                <Col>
                    { `End: ${moment.unix(rows.end).format('YYYY-MM-DD hh:mm:ss')}` }
                </Col>
                <Col>
                    { `Called Late: ${moment.unix(rows.start - data.start).format('m [mins] s [secs]')}` }
                </Col>
                <Col>
                    { `Left Earlier: ${moment.unix(data.end - rows.end).format('m [mins] s [secs]')}` }
                </Col>
            </Tooltip>
        );

        let callStart = rows.start,
        callEnd = rows.end,
        confEnd = data.end,
        confStart = data.start,
        N = 200,
        delta = (confEnd - confStart) / N,
        graphData = [];
        
        for(var i = 0; i< N; i++){
            var val;
            if(callStart <= confStart + i * delta  && callEnd >= confEnd - (N - i) * delta){
                val = 1;
            } else {
                val = 0;
            }

            graphData.push(val) ;
        }

        return (
            <Col className='start-end-block'>
                <OverlayTrigger placement="top" overlay={ tooltip }>
                    <div className='sparkline-block' id={rows.conferenceId}>
                        <Sparklines data={graphData} style={{background: "#CCCCCC"}} height={38}>
                            <SparklinesLine style={{ stroke: 'none', fill: '#007F00', fillOpacity:'0.8' }} />
                        </Sparklines>
                    </div>
                </OverlayTrigger>
            </Col>
        );
    }

    expandedComponent(rows){
        console.log('expandedComponent');
        var tableExpandedOptions = {
            noDataText: this.renderWaitingScreenExpanded(),
            onRowClick: this.expandedConfController.bind(this),
            expandBy: 'row'
        }

        return (
            <Col id={`conf-details-div-${rows.conferenceId}`} className="adr-details-template">
                <Row>
                    <Col md={12}>
                        <BootstrapTable data={ !rows.participants ? [] : rows.participants }
                                        striped={ true }
                                        hover={ true }
                                        options={ tableExpandedOptions }
                                        expandableRow={ this.expandableConfRow.bind(this) }
                                        expandComponent={ this.expandedConfComponent.bind(this, rows) }>
                            <TableHeaderColumn dataField="callId" isKey={ true } hidden={ true }></TableHeaderColumn>
                            <TableHeaderColumn width="40px" dataField="event" expandable={ true } dataFormat={ this.renderExpandedIcon.bind(this) }></TableHeaderColumn>
                            <TableHeaderColumn width="155px" dataSort={ true } expandable={ false } dataField="start" dataFormat={ this.renderStartEnd.bind(this, rows) }>Start - End</TableHeaderColumn>
                            <TableHeaderColumn dataSort={ true } expandable={ false } dataField="callerName">Caller Name</TableHeaderColumn>
                            <TableHeaderColumn dataSort={ true } expandable={ false } dataField="callerId">Caller Number</TableHeaderColumn>
                            <TableHeaderColumn dataSort={ true } expandable={ false } dataField="duration">Duration</TableHeaderColumn>
                            <TableHeaderColumn dataSort={ true } expandable={ false } dataField="rtpAudioInMos">MoS</TableHeaderColumn>
                            <TableHeaderColumn dataSort={ true } expandable={ false } dataField="rtpAudioInQualityPercentage">Quality %</TableHeaderColumn>
                            <TableHeaderColumn dataSort={ true } expandable={ false } dataFormat={ this.renderRTPIn.bind(this) }
                                               dataField="rtpAudioInMediaBytes">RTP In (packets/bytes)</TableHeaderColumn>
                            <TableHeaderColumn dataSort={ true } expandable={ false } dataFormat={ this.renderRTPOut.bind(this) }
                                               dataField="rtpAudioOutMediaPacketCount">RTP Out (packets/bytes)</TableHeaderColumn>
                        </BootstrapTable>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Col className="box box-default box-solid">
                            <Col className="box-body">
                                <Row>
                                    <Col md={12}>
                                        <ButtonToolbar>
                                            <Button onClick={ this.saveTableResultAsImage.bind(this, rows.conferenceId) } id="take-screenshot"><FontAwesome name="camera" />  Make screenshot</Button>
                                        </ButtonToolbar>
                                    </Col>
                                </Row>
                            </Col>
                        </Col>
                    </Col>
                </Row>
                
            </Col>
        );
    }

   	render () {
	    return ( 
            <Col>
                { this.expandedComponent(this.props.expandedData) }

                <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Participant JSON</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md={12}>
                                <FormGroup>
                                   <FormControl id='participantsJSON-textarea' componentClass="textarea" value={this.state.participantsJSON} />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleCloseModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </Col>  
        )
	}
}

ExpandedCDRComponent.propTypes = {
	expandedData: PropTypes.object
};

function mapStateToProps(state) {
    return {
        cdr: state.CdrData
    }
}

export default connect(mapStateToProps)(ExpandedCDRComponent);
