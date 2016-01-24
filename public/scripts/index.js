/* eslint-env jquery */

$().ready(function() {

  // When button clicked to generate signature
  $('#generate-signature').on('click', function() {

    // create data to send
    var data = getDataToGenerateSignature();

    // send data to generate signature
    $.ajax({
      url: "/eventhub/generate_signature",
      type: "post",
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(result) {
        $('#token').text(result.token);
      }
    });
    return false;
  });

  // When button clicked to send event
  $('#send-event').on('click', function() {
    var data = getDataToSendEvent();
    
    $.ajax({
      url: "/event/send_event",
      type: "post",
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(result) {
        $();
      }
    });
    return false;
  });
});

/**
 * get data to generate signature
 * 
 * @return data to generate signature
 */
function getDataToGenerateSignature() {
    var data = {
      "namespace": $('#namespace').val(),
      "hub_name": $('#hub-name').val(),
      "sender_key_name": $('#sender-key-name').val(),
      "sender_key": $('#sender-key').val(),
      "token_ttl": $('#token-ttl').val()
    };
  return data;
}

/**
 * get data to send event
 * 
 * @return data to send event
 */
function getDataToSendEvent() {
    var data = {
      "event_payload": $('#event-eventpayload').text(),
      "namespace": $('#namespace').val(),
      "hub_name": $('#hub-name').val(),
      "sender_key_name": $('#sender-key-name').val(),
      "sender_key": $('#sender-key').val(),
      "token_ttl": $('#token-ttl').val()
    };
  return data;
}