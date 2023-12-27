import { useState } from 'react'; // Import useState hook
import { m } from 'framer-motion';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios'; // Import Axios for making API requests
import { useSnackbar } from 'src/components/snackbar';
// components
import { MotionViewport, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function ContactForm() {
  const [isMessageSent, setMessageSent] = useState(false);
  const { enqueueSnackbar } = useSnackbar(); // Use enqueueSnackbar from your Snackbar provider

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const email = event.target.email.value;
    const subject = event.target.subject.value;
    const message = event.target.message.value;

    try {
      const response = await axios.post('http://localhost:8080/api/auth/submit-form', {
        name,
        email,
        subject,
        message,
        sendTo: 'support@threatvisor.org', // Fixed email address
      });

      if (response.status === 200) {
        console.log('Message sent successfully');
        setMessageSent(true);
        event.target.reset();

        // Show success message using enqueueSnackbar
        enqueueSnackbar('Message sent successfully', { variant: 'success' });

        setTimeout(() => setMessageSent(false), 5000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Show error message using enqueueSnackbar
      enqueueSnackbar('Failed to send message', { variant: 'error' });
    }
  };

  return (
    <Stack component={MotionViewport} spacing={5}>
      <m.div variants={varFade().inUp}>
        <Typography variant="h3">
          Reach out to us for any inquiries, concerns, or feedback. Let’s secure<br />
          your digital world together.
        </Typography>
      </m.div>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <m.div variants={varFade().inUp}>
            <TextField fullWidth label="Name" name="name" />
          </m.div>

          <m.div variants={varFade().inUp}>
            <TextField fullWidth label="Email" name="email" />
          </m.div>

          <m.div variants={varFade().inUp}>
            <TextField fullWidth label="Subject" name="subject" />
          </m.div>

          <m.div variants={varFade().inUp}>
            <TextField fullWidth label="Enter your message here." multiline rows={4} name="message" />
          </m.div>
        </Stack>

        <m.div variants={varFade().inUp} style={{ paddingTop: '20px' }} >
          <Button type="submit" size="large" variant="contained">
            Submit Now
          </Button>
        </m.div>
      </form>
    </Stack>
  );
}