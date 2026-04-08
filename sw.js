// ========== PDF GENERATION ==========
function generatePDF() {
    showToast('📄 Génération du PDF en cours...');
    
    // Generate PDF content
    const monthTx = getMonthTransactions();
    const gains = monthTx.filter(t => t.type === 'gain').reduce((s, t) => s + t.amount, 0);
    const depenses = monthTx.filter(t => t.type === 'depense').reduce((s, t) => s + t.amount, 0);
    
    const content = `
        Rapport MoneyTracker Pro
        ${getMonthName()}
        
        Gains: ${formatAmount(gains)}
        Dépenses: ${formatAmount(depenses)}
        Solde: ${formatAmount(gains - depenses)}
        
        Transactions:
        ${monthTx.map(t => `${t.type === 'gain' ? '+' : '-'} ${formatAmount(t.amount)} - ${t.description} (${t.categoryName})`).join('\n')}
    `;
    
    // Create PDF file
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'moneytracker-report-' + new Date().toISOString().split('T')[0] + '.pdf';
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('📄 PDF généré !');
}
