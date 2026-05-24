# Image Setup Instructions

## Required Images for Profile and Vehicle Display

To complete the profile and vehicle image integration, please add the following image files to the `public/images/` folder:

### 1. **profile-avatar.png** (120x120px recommended)
   - Location: `public/images/profile-avatar.png`
   - Description: User profile avatar image for Adrian Thorne
   - Current state: Placeholder for `/images/profile-avatar.png`
   - Used in: Profile section header (Hero section)

### 2. **car.png** (160x90px recommended)
   - Location: `public/images/car.png`
   - Description: Yellow vehicle image for Tesla Model Y
   - Current state: Placeholder for `/images/car.png`
   - Used in: Vehicle Registration section

## Image Specifications

### Profile Avatar (profile-avatar.png)
- Dimensions: 120x120 pixels
- Format: PNG with transparency recommended
- Style: User profile/headshot image
- Will be displayed with rounded corners and shadow effect

### Vehicle Image (car.png)
- Dimensions: 160x90 pixels (aspect ratio ~16:9)
- Format: PNG with transparency recommended
- Style: Car image on dark background
- Will be displayed centered in a dark gradient background

## How to Add Images

1. Create the `public/images/` folder if it doesn't exist
2. Place your images in this folder with the exact filenames above
3. Restart your development server
4. The images should now display in:
   - Profile page: `/dashboard/profile`
   - Vehicle section in the profile card

## Code References

The following components have been updated to use these images:
- `components/dashboard/profile/UserProfile.tsx` (lines with `<img>` tags)
- Styles for image sizing and positioning have been added

If you need to update image paths or filenames, edit the `src` attributes in `UserProfile.tsx` and update this document accordingly.
