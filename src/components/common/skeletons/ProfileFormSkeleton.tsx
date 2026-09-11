/**
 * ProfileFormSkeleton
 * Matches the profile edit form layout inside AccountPage:
 *  - 2 name input fields (grid 2-col on sm+)
 *  - Email read-only field
 *  - Phone read-only field
 *  - Save button
 * Uses DaisyUI `skeleton` class for theme-aware shimmer.
 */
function ProfileFormSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      {/* Name Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="skeleton h-3.5 w-20 rounded mb-1.5" />
          <div className="skeleton h-10 w-full rounded-2xl" />
        </div>
        <div>
          <div className="skeleton h-3.5 w-20 rounded mb-1.5" />
          <div className="skeleton h-10 w-full rounded-2xl" />
        </div>
      </div>

      {/* Email */}
      <div>
        <div className="skeleton h-3.5 w-28 rounded mb-1.5" />
        <div className="skeleton h-10 w-full rounded-2xl" />
      </div>

      {/* Phone */}
      <div>
        <div className="skeleton h-3.5 w-28 rounded mb-1.5" />
        <div className="skeleton h-10 w-full rounded-2xl" />
      </div>

      {/* Submit button area */}
      <div className="flex justify-end pt-3 border-t border-neutral-100">
        <div className="skeleton h-8 w-32 rounded-full" />
      </div>
    </div>
  );
}

export default ProfileFormSkeleton;
