// LockIcon.jsx
const LockIcon = ({ ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" 
       fill="none" viewBox="0 0 24 24" 
       stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M12 11c.828 0 1.5-.672 1.5-1.5V7.5A1.5 1.5 0 0012 6a1.5 1.5 0 00-1.5 1.5V9.5c0 .828.672 1.5 1.5 1.5zM6 11h12v9H6v-9z" />
  </svg>
);
export default LockIcon;