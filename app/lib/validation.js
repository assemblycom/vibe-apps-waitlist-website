const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateWaitlistForm({ name, email, company }) {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = "Name is required";
  } else if (name.trim().length > 100) {
    errors.name = "Name must be under 100 characters";
  }

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_RE.test(email.trim())) {
    errors.email = "Please enter a valid email";
  }

  if (!company || !company.trim()) {
    errors.company = "Company is required";
  } else if (company.trim().length > 200) {
    errors.company = "Company must be under 200 characters";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
