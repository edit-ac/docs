import Foundation
import PDFKit
let document = PDFDocument(url: URL(fileURLWithPath: CommandLine.arguments[1]))!
let text = (0..<document.pageCount).map { document.page(at:$0)!.string ?? "" }.joined(separator:"\n")
for expected in ["Project kickoff", "Owner: Alex", "Due Friday", "Draft agenda", "Confirm attendees", "Reference"] {
 precondition(text.contains(expected), "Missing captured content: \(expected)")
}
precondition(document.pageCount > 0 && !document.isEncrypted)
print(String(data:try! JSONSerialization.data(withJSONObject:["reader":"macOS PDFKit", "pages":document.pageCount, "text":text],options:[.sortedKeys]),encoding:.utf8)!)
