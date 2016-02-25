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
        showSuccessMessage('Generating token is success.');
        $('#token').text(result.token);
      },
      error: function() {
        showWarning();
      }
    });
    return false;
  });

  // When button clicked to send event
  $('#send-event').on('click', function() {
    var data = getDataToSendEvent();
    
    $.ajax({
      url: "/eventhub/send_event",
      type: "post",
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(result) {
        $('.alert').addClass('alert-info').text('Data sent.');
      },
      error: function() {
        showWarning();
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
      "payload": $('#event-payload').val(),
      "namespace": $('#namespace').val(),
      "hub_name": $('#hub-name').val(),
      "sender_key_name": $('#sender-key-name').val(),
      "sender_key": $('#sender-key').val(),
      "token_ttl": $('#token-ttl').val()
    };
  return data;
}

/**
 * show warning message
 */
function showWarning() {
  // show warining message
  $('.alert-message').append(
    '<div class="alert alert-warning alert-dismissible">' +
    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
    '<span aria-hidden="true">&times;</span>' +
    '</button>' +
    'Something\'s wrong :(</div>');
}

/**
 * show Success message
 * 
 * @param string message message to show
 */
function showSuccessMessage(message) {
  // Show Success message
  $('.alert-message').append(
    '<div class="alert alert-success alert-dismissible">' +
    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
    '<span aria-hidden="true">&times;</span>' +
    '</button>' +
    message + '</div>');
}