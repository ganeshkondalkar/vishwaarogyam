<div>
<?php
	if( $_SERVER["REQUEST_METHOD"] == "POST" ){
		parse_str( $_POST["data"], $enquiryFormData);
		$to = "vishwaarogyam@gmail.com";
		$name = $enquiryFormData["name"];
		$mobile = $enquiryFormData["mobile"];
		$email = $enquiryFormData["email"];
		$subject = $enquiryFormData["subject"];
		$message = "<h3>Enquiry Form Details.</h3>";
		$message = "<table>";
		$message .= "<tr><td>NAME: </td><td><strong>" . $name . "</strong></td></tr>";
		$message .= "<tr><td>EMAIL: </td><td><strong>" . $email . "</strong></td></tr>";
		$message .= "<tr><td>MOBILE: </td><td><strong>" . $mobile . "</strong></td></tr>";
		$message .= "<tr><td>MESSAGE: </td><td>" . $enquiryFormData["message"] . "</strong></td></tr>";
		$message .= "</table>";

		$header = "From:" . $email . " \r\n";
		/* $header = "Cc:" . $_POST["email"] . " \r\n";*/
		$header .= "MIME-Version: 1.0\r\n";
		$header .= "Content-type: text/html\r\n";

		$returnValue = mail($to, $subject, $message, $header);

		if( $returnValue == true ){
			echo "<p>Thank you <strong>" . $name . " </strong>!<br> Your Message sent successfully.</p>";
		} else {
			echo "<p>Sorry <strong>" . $name . " </strong>!<br> Your Message could not be sent.</p>";
		}

	}
?>
</div>