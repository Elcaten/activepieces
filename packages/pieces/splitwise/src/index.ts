
import { createPiece, PieceAuth } from "@activepieces/pieces-framework";
import { createExpense } from "./lib/actions/create-expense";

export const splitwiseAuth = PieceAuth.OAuth2({
  required: true,
  authUrl: 'https://secure.splitwise.com/oauth/authorize',
  tokenUrl: 'https://secure.splitwise.com/oauth/token',
  scope: []
})

export const splitwise = createPiece({
  displayName: "Splitwise",
  auth: splitwiseAuth,
  minimumSupportedRelease: '0.9.0',
  logoUrl: "https://cdn.activepieces.com/pieces/splitwise.png",
  authors: [],
  actions: [createExpense],
  triggers: [],
});


