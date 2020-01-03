const constructMeetingData = (response) => {
    return {
        meetingId: response.body.MeetingId,
        meetingDate: response.body.MeetingDate,
        bookingId: response.body.BookingId,
        subject: response.body.Subject,
        trackingId: response.body.TrackingId
    }
}

module.exports = {
    constructMeetingData: constructMeetingData
};


