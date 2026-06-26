import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace SuccessModal with SuccessPage
content = content.replace("import SuccessModal from './components/SuccessModal';", "import SuccessPage from './components/SuccessPage';")

# Change initial state
content = content.replace("const [checkoutStage, setCheckoutStage] = useState<CheckoutStage>('DATA_ENTRY');", "const [checkoutStage, setCheckoutStage] = useState<CheckoutStage>('INFO');")

# Remove SuccessModal render block
content = re.sub(r'\{/\* C\. Payment Success Confirmation pop-up \*/\}.*?/>', '', content, flags=re.DOTALL)

# Now, rewrite the main tag
main_start = content.find('      {/* 2. MAIN CORE LAYOUT */}')
main_end = content.find('      </main>') + 13

new_main = '''      {/* 2. MAIN CORE LAYOUT */}
      <main id="checkout-portal" className="flex-1 overflow-y-auto relative p-6 sm:p-10 flex flex-col items-center bg-[#070A12]/50">
        <div className="w-full max-w-[700px] flex flex-col h-full">
          
          {checkoutStage !== 'INFO' && checkoutStage !== 'COMPLETED' && (
            <div className="w-full mb-8">
              <StepHeader currentStage={checkoutStage} />
            </div>
          )}

          <div className="flex-1 space-y-6">
            <AnimatePresence mode="wait">
              {checkoutStage === 'INFO' && (
                <motion.div
                  key="stage-info"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.25 }}
                  className="glass-card p-6"
                >
                  <BrandingPanel onDaftarClick={() => {
                    setCheckoutStage('DATA_ENTRY');
                    setTimeout(() => {
                      const portal = document.getElementById('checkout-portal');
                      if (portal) portal.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                  }} />
                </motion.div>
              )}
'''

original_data_entry = content[content.find("{checkoutStage === 'DATA_ENTRY' && ("):content.find("{checkoutStage === 'SELECT_PAYMENT' && (")]

original_select_payment = content[content.find("{checkoutStage === 'SELECT_PAYMENT' && ("):content.find("{checkoutStage === 'CONFIRMATION' && (")]

original_confirmation = content[content.find("{checkoutStage === 'CONFIRMATION' && ("):content.find("</AnimatePresence>", content.find("{checkoutStage === 'CONFIRMATION' && ("))]

new_main += "              " + original_data_entry.strip() + "\n\n"
new_main += "              " + original_select_payment.strip() + "\n\n"
new_main += "              " + original_confirmation.strip() + "\n\n"

new_main += '''
              {checkoutStage === 'COMPLETED' && (
                <motion.div
                  key="stage-completed"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <SuccessPage 
                    paymentOption={selectedPayment}
                    amountPaid={currentBillAmount}
                    selectedMethodName={selectedMethodName}
                    onOpenInvoice={() => setIsInvoiceOpen(true)}
                    onRestart={handleRestartFlow}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>'''

content = content[:main_start] + new_main + content[main_end:]

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
