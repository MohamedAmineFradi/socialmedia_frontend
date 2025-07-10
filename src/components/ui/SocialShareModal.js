'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal, Box, IconButton, Typography, Snackbar, SnackbarContent, Stack, Tooltip
} from '@mui/material';
import {
  EmailShareButton, FacebookShareButton, TwitterShareButton,
  TelegramShareButton, LinkedinShareButton, WhatsappShareButton,
  RedditShareButton, PinterestShareButton, TumblrShareButton,
  LineShareButton, VKShareButton, InstapaperShareButton, PocketShareButton
} from 'react-share';

import ShareIcon from '@mui/icons-material/Share';
import LinkIcon from '@mui/icons-material/Link';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import RedditIcon from '@mui/icons-material/Reddit';
import PinterestIcon from '@mui/icons-material/Pinterest';
import PublicIcon from '@mui/icons-material/Public';
import LineIcon from '@mui/icons-material/LineStyle';
import VkIcon from '@mui/icons-material/Public';
import InstapaperIcon from '@mui/icons-material/ImportContacts';
import SaveIcon from '@mui/icons-material/Save';
import CheckIcon from '@mui/icons-material/Check';

const SOCIALS = [
  { label: 'Copy link', icon: <LinkIcon />, color: '#fb5c1d', action: 'copy' },
  { label: 'Email', icon: <EmailIcon />, color: '#009ddb', component: EmailShareButton },
  { label: 'Facebook', icon: <FacebookIcon />, color: '#1877f3', component: FacebookShareButton },
  { label: 'X', icon: <TwitterIcon />, color: '#171717', component: TwitterShareButton },
  { label: 'Telegram', icon: <TelegramIcon />, color: '#229ed9', component: TelegramShareButton },
  { label: 'LinkedIn', icon: <LinkedInIcon />, color: '#0077b5', component: LinkedinShareButton },
  { label: 'Whatsapp', icon: <WhatsAppIcon />, color: '#25d366', component: WhatsappShareButton },
  { label: 'Reddit', icon: <RedditIcon />, color: '#ff4500', component: RedditShareButton },
];

const SocialShareModal = ({ url, title = '', description = '' }) => {
  const [open, setOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url || "");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (!url && typeof window !== 'undefined') {
      setCurrentUrl(window.location.href || "");
    }
  }, [url]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setSnackbarOpen(true);
    }).catch(() => {
      console.log("Failed to copy");
    });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <div>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Tooltip title="Share">
          <IconButton onClick={handleOpen} aria-label="Open social share options" sx={{ color: '#009ddb', bgcolor: 'white', border: '1px solid #009ddb', '&:hover': { bgcolor: '#e6f7fb' } }}>
            <ShareIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 340,
          bgcolor: 'var(--background)', boxShadow: 24, p: 4,
          borderRadius: '18px',
          outline: 'none',
        }}>
          <Typography variant="h6" sx={{ color: '#009ddb', mb: 2, fontWeight: 700 }}>Share</Typography>
          <Stack direction="row" flexWrap="wrap" gap={2} justifyContent="center">
            {SOCIALS.map((social, idx) => {
              if (social.action === 'copy') {
                return (
                  <Tooltip title={social.label} key={social.label}>
                    <IconButton
                      onClick={handleCopyLink}
                      sx={{
                        color: '#fff',
                        bgcolor: social.color,
                        '&:hover': { bgcolor: '#fa5c1a' },
                        width: 48, height: 48,
                        borderRadius: '50%',
                        boxShadow: 1,
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  </Tooltip>
                );
              } else {
                const ShareButton = social.component;
                return (
                  <ShareButton
                    url={currentUrl}
                    title={title}
                    summary={description}
                    key={social.label}
                    style={{ display: 'inline-block' }}
                  >
                    <Tooltip title={social.label}>
                      <IconButton
                        sx={{
                          color: '#fff',
                          bgcolor: social.color,
                          '&:hover': { opacity: 0.85 },
                          width: 48, height: 48,
                          borderRadius: '50%',
                          boxShadow: 1,
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    </Tooltip>
                  </ShareButton>
                );
              }
            })}
          </Stack>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={
          <IconButton onClick={handleSnackbarClose} color="inherit">
            <CheckIcon />
          </IconButton>
        }
      >
        <SnackbarContent
          sx={{ bgcolor: '#009d4f', color: 'white', fontWeight: 600 }}
          message="Link copied to clipboard!"
        />
      </Snackbar>
    </div>
  );
};

export default SocialShareModal; 