export const clerkAuthAppearance = {
  layout: {
    showOptionalFields: false,
    socialButtonsPlacement: 'top',
  },
  elements: {
    rootBox: 'w-full',
    card: 'bg-white shadow-sm border border-gray-200 rounded-2xl p-8 w-full',
    headerTitle: 'text-xl font-bold text-gray-900',
    headerSubtitle: 'text-gray-500 text-sm mb-6',
    socialButtonsBlockButton:
      'border-gray-300 hover:bg-gray-50 rounded-xl py-3 text-sm font-medium text-gray-700',
    socialButtonsBlockButtonText: 'font-medium text-gray-700',
    dividerLine: 'bg-gray-200',
    dividerText: 'text-gray-400 text-xs',
    formFieldInput:
      'border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 py-3 text-sm',
    formFieldLabel: 'text-gray-700 text-sm font-medium mb-1.5',
    formButtonPrimary:
      'bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold normal-case py-3 rounded-xl w-full',
    footerActionLink: 'text-orange-600 hover:text-orange-700 font-semibold text-sm',
    identityPreviewText: 'text-sm text-gray-600',
    identityPreviewEditButton: 'text-orange-600 text-sm',
    // Hide username — sign up should use email only (matches sign-in)
    formFieldRow__username: { display: 'none' },
    formFieldInput__username: { display: 'none' },
  },
}
