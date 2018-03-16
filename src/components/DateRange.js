import 'bootstrap-daterangepicker/daterangepicker.css'

import React from 'react'
import PropTypes from 'prop-types'
import DatetimeRangePicker from "./DatetimeRangePicker/DatetimeRangePicker"
import moment from 'moment'

class DateRange extends React.Component {
    constructor(props){
        super(props);

        this.locale = {
            format: 'YYYY-MM-DD HH:mm:ss',
            separator: ' - ',
            applyLabel: 'Apply',
            cancelLabel: 'Cancel'
        };
    }

    currentRangesLabel(){
        let start = this.props.startDate.format(this.locale.format),
        end = this.props.endDate.format(this.locale.format),
        startRange = moment(this.props.startDate).unix(),
        endRange = moment(this.props.endDate).unix(),
        timeDifference = endRange - startRange,
        label;

        switch(timeDifference) {
            case 3600:
                label = 'Last 1 hours';               
                break;
            case 10800:
                label = 'Last 3 hours';
                break;
            case 21600:
                label = 'Last 6 hours';
                break;    
            default:
                label = [start, end].join(this.locale.separator);
                break;
        }

        return label;
    }

    render() {
        let start = this.props.startDate.format(this.locale.format),
        end = this.props.endDate.format(this.locale.format),
        label = start === end ? start : [start, end].join(this.locale.separator),
        currentLabel = this.props.type === "timeRanges" ? this.currentRangesLabel() : label;

        return (
            <DatetimeRangePicker id="daterange"
                                 style={{minWidth: '270px'}}
                                 timePicker
                                 timePicker24Hour
                                 showDropdowns
                                 linkedCalendars={false}
                                 opens={this.props.openStyle === 'center' ? 'center' : 'left'}
                                 ranges={this.props.ranges}
                                 locale={this.locale}
                                 startDate={this.props.startDate}
                                 endDate={this.props.endDate}
                                 onApply={(e, picker) => this.props.onChange(picker)}>
                <div className="dropdown-input">
                    <span className="form-control default date-range-toggle">{currentLabel}</span>
                </div>
            </DatetimeRangePicker>
        )
    }
}

DateRange.propTypes = {
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    ranges: PropTypes.object,
    openStyle: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func.isRequired
}

export default DateRange;
