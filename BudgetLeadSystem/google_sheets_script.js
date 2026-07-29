function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  var range = e.range;
  
  // අපේ Column අංක ටික (B = Budget, C = Total Leads, D = Confirmed Leads, E = Cost per Lead)
  var row = range.getRow();
  var col = range.getColumn();
  
  // පේළි අංක 1 (Header row) එක නම් කෝඩ් එක රන් වෙන්න එපා
  if (row <= 1) return;
  
  // Daily Budget (Col 2) හෝ Total Leads (Col 3) වෙනස් වුණොත් විතරක් Cost per Lead එක ඔටෝ හදන්න
  if (col == 2 || col == 3) {
    var budget = sheet.getRange(row, 2).getValue();
    var totalLeads = sheet.getRange(row, 3).getValue();
    
    var costPerLeadCell = sheet.getRange(row, 5); // Column E
    
    // Leads ගණන 0 ට වඩා වැඩි නම් විතරක් බෙදන්න (Error එන එක නවත්තන්න)
    if (totalLeads > 0 && budget > 0) {
      var costPerLead = budget / totalLeads;
      costPerLeadCell.setValue(costPerLead);
    } else {
      costPerLeadCell.setValue(0);
    }
  }
  
  // සතිපතා Totals (එකතුවන්) ඔටෝම අප්ඩේට් කරන්න මේ කොටස ක්රියාත්මක වෙනවා
  updateWeeklyTotals(sheet);
}

// සතිපතා දත්ත කාණ්ඩ වල එකතුව ස්වයංක්රීයව ගණනය කරන Function එක
function updateWeeklyTotals(sheet) {
  var lastRow = sheet.getLastRow();
  var currentBudgetSum = 0;
  var currentLeadsSum = 0;
  var currentConfirmedSum = 0;
  var startRow = 2;
  
  for (var i = 2; i <= lastRow; i++) {
    var dayValue = sheet.getRange(i, 1).getValue().toString();
    
    // යම් පේළියක "Total" කියලා ලියවිලා තිබුණොත් එතනට එතකන් ආපු එකතුව දානවා
    if (dayValue.includes("Total") || dayValue.includes("total")) {
      sheet.getRange(i, 2).setValue(currentBudgetSum);
      sheet.getRange(i, 3).setValue(currentLeadsSum);
      sheet.getRange(i, 4).setValue(currentConfirmedSum);
      
      // Cost per Lead එකතුව සඳහා සාමාන්යය (Average) දැමීම
      if (currentLeadsSum > 0) {
        sheet.getRange(i, 5).setValue(currentBudgetSum / currentLeadsSum);
      }
      
      // ඊළඟ සතිය සඳහා එකතුවන් බිංදුව කරන්න
      currentBudgetSum = 0;
      currentLeadsSum = 0;
      currentConfirmedSum = 0;
    } else {
      // සාමාන්ය දිනවල දත්ත එකතු කර ගැනීම
      currentBudgetSum += Number(sheet.getRange(i, 2).getValue()) || 0;
      currentLeadsSum += Number(sheet.getRange(i, 3).getValue()) || 0;
      currentConfirmedSum += Number(sheet.getRange(i, 4).getValue()) || 0;
    }
  }
}
