const jsdom = require("jsdom");
const fs = require('fs');
const { containerClasses } = require("@mui/system");
const { get } = require("http");
const { breadcrumbsClasses } = require("@mui/material");
const { dir } = require("console");

async function get_statistics_first() {
    const res = await fetch('http://chreg.eng.cu.edu.eg/chsresultstatistics.aspx?s=1');
    const html = await res.text();
    const dom = new jsdom.JSDOM(html);
    const document = dom.window.document
    return {doc: document, html: html};
}

async function get_all_stats(term, prog, showAll = false) {

    formString = `ScriptManager1=UpdatePanel1%7C${showAll?'ButShowAllSubjects':'lstTerm'}&lstTerm=${term}&lstProg=${prog}&lstSubject=0&__EVENTTARGET=${showAll?'':'lstTerm'}&__EVENTARGUMENT=&__LASTFOCUS=&__VIEWSTATE=%2FwEPDwUIMTQ3MTg5OTUPZBYCAgMPZBYCAgMPZBYCZg9kFigCAQ8QDxYCHgtfIURhdGFCb3VuZGdkEBUxCUZhbGwgMjAyMgtTdW1tZXIgMjAyMgtTcHJpbmcgMjAyMglGYWxsIDIwMjELU3VtbWVyIDIwMjELU3ByaW5nIDIwMjEJRmFsbCAyMDIwC1N1bW1lciAyMDIwC1NwcmluZyAyMDIwCUZhbGwgMjAxOQtTdW1tZXIgMjAxOQtTcHJpbmcgMjAxOQlGYWxsIDIwMTgLU3VtbWVyIDIwMTgLU3ByaW5nIDIwMTgJRmFsbCAyMDE3C1N1bW1lciAyMDE3C1NwcmluZyAyMDE3CUZhbGwgMjAxNgtTdW1tZXIgMjAxNgtTcHJpbmcgMjAxNglGYWxsIDIwMTULU3VtbWVyIDIwMTULU3ByaW5nIDIwMTUJRmFsbCAyMDE0C1N1bW1lciAyMDE0C1NwcmluZyAyMDE0CUZhbGwgMjAxMwtTdW1tZXIgMjAxMwtTcHJpbmcgMjAxMwlGYWxsIDIwMTILU3VtbWVyIDIwMTILU3ByaW5nIDIwMTIJRmFsbCAyMDExC1N1bW1lciAyMDExC1NwcmluZyAyMDExCUZhbGwgMjAxMAtTdW1tZXIgMjAxMAtTcHJpbmcgMjAxMAlGYWxsIDIwMDkLU3VtbWVyIDIwMDkLU3ByaW5nIDIwMDkJRmFsbCAyMDA4C1N1bW1lciAyMDA4C1NwcmluZyAyMDA4CUZhbGwgMjAwNwtTdW1tZXIgMjAwNwtTcHJpbmcgMjAwNwlGYWxsIDIwMDYVMQI0OQI0OAI0NwI0NgI0NQI0NAI0MwI0MgI0MQI0MAIzOQIzOAIzNwIzNgIzNQIzNAIzMwIzMgIzMQIzMAIyOQIyOAIyNwIyNgIyNQIyNAIyMwIyMgIyMQIyMAIxOQIxOAIxNwIxNgIxNQIxNAIxMwIxMgIxMQIxMAE5ATgBNwE2ATUBNAEzATIBMRQrAzFnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnFgECGGQCBQ8QDxYCHwBnZBAVFCRbU0VFXSBTdXN0YWluYWJsZSBFbmVyZ3kgRW5naW5lZXJpbmcqW01FTV0gTWFudWZhY3R1cmluZyBFbmdpbmVlcmluZyYgTWF0ZXJpYWxzKVtJRU1dIEluZHVzdHJpYWwgRW5naW5lZXJpbmcgJiBNYW5hZ2VtZW50HltNRUVdIE1lY2hhdHJvbmljcyBFbmdpbmVlcmluZytbSEVNXSBIZWFsdGhjYXJlIEVuZ2luZWVyaW5nIGFuZCBNYW5hZ2VtZW50JltDSUVdIENpdmlsIEluZnJhc3RydWN0dXJlIEVuZ2luZWVyaW5nI1tFRUVdIEVsZWN0cmljYWwgRW5lcmd5IEVuZ2luZWVyaW5nLltQUENDXSBQZXRyb2xldW0gYW5kIFBldHJvY2hlbWljYWwgRW5naW5lZXJpbmcuW1BQQ1BdIFBldHJvbGV1bSBhbmQgUGV0cm9jaGVtaWNhbCBFbmdpbmVlcmluZyhbV0VFXSBXYXRlciBFbmdpbmVlcmluZyBhbmQgRW52aXJvbm1lbnQgLVtDQ0VFXSBDb21tdW5pY2F0aW9uIGFuZCBDb21wdXRlciBFbmdpbmVlcmluZy1bQ0NFQ10gQ29tbXVuaWNhdGlvbiBhbmQgQ29tcHV0ZXIgRW5naW5lZXJpbmccW1NURV0gU3RydWN0dXJhbCBFbmdpbmVlcmluZy9bQUVNXSBBZXJvbmF1dGljYWwgRW5nLiBhbmQgQXZpYXRpb24gTWFuYWdlbWVudCNbTURFXSBNZWNoYW5pY2FsIERlc2lnbiBFbmdpbmVlcmluZy5bQUVUXSBBcmNoaXRlY3R1cmFsIEVuZ2luZWVyaW5nIGFuZCBUZWNobm9sb2d5LVtQUENdIFBldHJvbGV1bSBhbmQgUGV0cm9jaGVtaWNhbCBFbmdpbmVlcmluZy1bQ0VNXSBDb25zdHJ1Y3Rpb24gRW5naW5lZXJpbmcgYW5kIE1hbmFnZW1lbnQsW0NDRV0gQ29tbXVuaWNhdGlvbiBhbmQgQ29tcHV0ZXIgRW5naW5lZXJpbmcMQWxsIFByb2dyYW1zFRQCMjMCMjICMjECMjACMTkCMTgCMTcCMTMCMTICMTECMTABOQE4ATcBNQE0ATMBMgExATAUKwMUZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dkZAIHDw9kDxAWAWYWARYCHg5QYXJhbWV0ZXJWYWx1ZQUBMRYBAgRkZAIJDxAPFgIfAGdkEBU9DEFsbCBTdWJqZWN0cxFDQ0VOMjgwOlNlbWluYXItMRFDQ0VOMzgwOlNlbWluYXItMh1DQ0VOMzgxOkluZHVzdHJpYWwgVHJhaW5pbmctMhxDQ0VONDgwOkdyYWR1YXRpb24gUHJvamVjdC0xFkNNUE4xMDE6TG9naWMgRGVzaWduLTEmQ01QTjEwMjpEYXRhIFN0cnVjdHVyZXMgYW5kIEFsZ29yaXRobXMgQ01QTjIwMTpNaWNyb3Byb2Nlc3NvciBTeXN0ZW1zLTEzQ01QTjIwMjpJbnRyb2R1Y3Rpb24gdG8gRGF0YWJhc2UgTWFuYWdlbWVudCBTeXN0ZW1zHUNNUE4zMDE6Q29tcHV0ZXIgQXJjaGl0ZWN0dXJlGUNNUE4zMDM6T3BlcmF0aW5nIFN5c3RlbXMbQ01QTjQwNTpDb21wdXRlciBOZXR3b3Jrcy0xGUNWRU4xMjU6Q2l2aWwgRW5naW5lZXJpbmcSRUxDTjEwMDpMYWJvcmF0b3J5EkVMQ04xMDI6Q2lyY3VpdHMtMRJFTENOMTEyOkNpcmN1aXRzLTI0RUxDTjIwMTpFbGVjdHJvbmljcy0yIEFuYWxvZyBhbmQgRGlnaXRhbCBFbGVjdHJvbmljcxdFTENOMjAzOlNpZ25hbCBBbmFseXNpcxpFTENOMjA1OkVsZWN0cm9tYWduZXRpY3MtMRFFTENOMzA0OkNvbnRyb2wtMTBFTENOMzA2OkNvbW11bmljYXRpb25zLTEgQW5hbG9ndWUgQ29tbXVuaWNhdGlvbnMgRUxDTjMxNDpDb21wdXRlciBDb250cm9sIFN5c3RlbXMYRUxDTjMxNjpDb21tdW5pY2F0aW9ucy0yIUVMQ04zMjM6RGlnaXRhbCBTaWduYWwgUHJvY2Vzc2luZxFFTENONDA0OkNvbnRyb2wtMhpFTENONDA1OkVsZWN0cm9tYWduZXRpY3MtMxhFTENONDA2OkNvbW11bmljYXRpb25zLTMkRUxDTjQyNjpPcHRpY2FsIEZpYmVyIENvbW11bmljYXRpb25zKEVMQ040NDE6QWR2YW5jZWQgVG9waWNzIGluIEVsZWN0cm9uaWNzLTIgRUxDTjQ2NjpTYXRlbGxpdGUgQ29tbXVuaWNhdGlvbnMkRVBNTjEyNTpFbGVjdHJpY2FsIFBvd2VyIEVuZ2luZWVyaW5nIkdFTk4wMDE6SHVtYW5pdGllcyBhbmQgRW5naW5lZXJpbmcYR0VOTjAwMjpFbmdsaXNoIExhbmd1YWdlIEdFTk4wMDM6QmFzaWMgRW5naW5lZXJpbmcgRGVzaWduH0dFTk4wMDQ6Q29tcHV0ZXJzIGZvciBFbmdpbmVlcnMZR0VOTjEwMTpUZWNobmljYWwgV3JpdGluZyJHRU5OMTAyOkZ1bmRhbWVudGFscyBvZiBNYW5hZ2VtZW50LUdFTk4yMDE6Q29tbXVuaWNhdGlvbiBhbmQgUHJlc2VudGF0aW9uIFNraWxscxJHRU5OMjA0OkFjY291bnRpbmcnR0VOTjIxMDpSaXNrIE1hbmFnZW1lbnQgYW5kIEVudmlyb25tZW50EUdFTk4yMjE6RWNvbm9taWNzHkdFTk4zMDE6RXRoaWNzIGFuZCBMZWdpc2xhdGlvbhFHRU5OMzI2Ok1hcmtldGluZyZHRU5OMzI3OlNlbGVjdGlvbnMgb2YgTGlmZSBMb25nIFNraWxscx5HRU5OMzMxOkJ1c2luZXNzIENvbW11bmljYXRpb24aR0VOTjMzMjpTZXJ2aWNlIE1hbmFnZW1lbnQeSU5UTjEyNTpNZWNoYW5pY2FsIEVuZ2luZWVyaW5nHE1EUE4wMDE6RW5naW5lZXJpbmcgR3JhcGhpY3MxTURQTjAwMjpGdW5kYW1lbnRhbHMgb2YgTWFudWZhY3R1cmluZyBFbmdpbmVlcmluZxNNRUNOMDAxOk1lY2hhbmljcy0xE01FQ04wMDI6TWVjaGFuaWNzLTI8TVRITjAwMTpJbnRyb2R1Y3Rpb24gdG8gTGluZWFyIEFsZ2VicmEgYW5kIEFuYWx5dGljIEdlb21ldHJ5Ek1USE4wMDI6Q2FsY3VsdXMgSTFNVEhOMTAyOk11bHRpdmFyaWFibGUgQ2FsY3VsdXMgYW5kIExpbmVhciBBbGdlYnJhHk1USE4xMDM6RGlmZmVyZW50aWFsIEVxdWF0aW9ucxxNVEhOMTA0OkRpc2NyZXRlIE1hdGhlbWF0aWNzGk1USE4yMDE6TnVtZXJpY2FsIEFuYWx5c2lzIk1USE4yMDM6UHJvYmFiaWxpdHkgYW5kIFN0YXRpc3RpY3M5UEhZTjAwMTpNZWNoYW5pY3MsIE9zY2lsbGF0aW9ucywgV2F2ZXMgYW5kIFRoZXJtb2R5bmFtaWNzIVBIWU4wMDI6RWxlY3RyaWNpdHkgYW5kIE1hZ25ldGlzbRZQSFlOMTAyOk1vZGVybiBQaHlzaWNzFT0BMAgyMDE0MDA0OQgyMDE0MDA1MQgyMDE0MDA1MggyMDE0MDA1MwgyMDE0MDA4OQgyMDE0MDA5MAgyMDE0MDA5MwgyMDE0MDA5NAgyMDE0MDA5OQgyMDE0MDEwMQgyMDE0MDEwOQgyMDE0MDEyOAgyMDE0MDEzMAgyMDE0MDEzMggyMDE0MDEzMwgyMDE0MDEzNAgyMDE0MDEzNQgyMDE0MDEzNggyMDE0MDEzOAgyMDE0MDE0MAgyMDE0MDE0MQgyMDE0MDE0MggyMDE0MDE0NAgyMDE0MDE0OAgyMDE0MDE0OQgyMDE0MDE1MAgyMDE0MDE1MggyMDE0MDE1NQgyMDE0MDE1OQgyMDE0MDE2MggyMDE0MDE2NggyMDE0MDE2NwgyMDE0MDE2OAgyMDE0MDE2OQgyMDE0MDE3MAgyMDE0MDE3MQgyMDE0MDE3MggyMDE0MDE3MwgyMDE0MDE3NAgyMDE0MDE3NQgyMDE0MDE3NggyMDE0MDE3OQgyMDE0MDE4MAgyMDE0MDQ1NggyMDE0MDE4MQgyMDE0MDIyMQgyMDE0MDIzNQgyMDE0MDIzNggyMDE0MDI3MggyMDE0MDI3MwgyMDE0MDI4MggyMDE0MDI4MwgyMDE0MDI4NQgyMDE0MDI4NggyMDE0MDI4NwgyMDE0MDI4OAgyMDE0MDI4OQgyMDE0MDMzMQgyMDE0MDMzMggyMDE0MDMzMxQrAz1nZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZGQCCw8PZA8QFgJmAgEWAhYCHwEFAjI1FgIfAQUCMTAWAmZmZGQCDQ8WAh4LXyFJdGVtQ291bnQCDRYaAgEPZBYCZg8VAQpQUCAgICAgICAgZAICD2QWAmYPFQEKQSsgICAgICAgIGQCAw9kFgJmDxUBCkEgICAgICAgICBkAgQPZBYCZg8VAQpBLSAgICAgICAgZAIFD2QWAmYPFQEKQisgICAgICAgIGQCBg9kFgJmDxUBCkIgICAgICAgICBkAgcPZBYCZg8VAQpCLSAgICAgICAgZAIID2QWAmYPFQEKQysgICAgICAgIGQCCQ9kFgJmDxUBCkMgICAgICAgICBkAgoPZBYCZg8VAQpDLSAgICAgICAgZAILD2QWAmYPFQEKRCsgICAgICAgIGQCDA9kFgJmDxUBCkQgICAgICAgICBkAg0PZBYCZg8VAQpGICAgICAgICAgZAIPDxYCHwICDRYaAgEPZBYCZg8VAQEwZAICD2QWAmYPFQEBMGQCAw9kFgJmDxUBATBkAgQPZBYCZg8VAQEyZAIFD2QWAmYPFQEBNWQCBg9kFgJmDxUBATNkAgcPZBYCZg8VAQEzZAIID2QWAmYPFQEBMWQCCQ9kFgJmDxUBATNkAgoPZBYCZg8VAQExZAILD2QWAmYPFQEBMmQCDA9kFgJmDxUBATFkAg0PZBYCZg8VAQExZAITDzwrABECARAWABYAFgAMFCsAAGQCFQ8PZA8QFgJmAgEWAhYCHwEFAjI1FgIfAQUCMTAWAmZmZGQCFw8WAh8CAg0WGgIBD2QWAmYPFQEDPCAxZAICD2QWAmYPFQEHMSAtIDEuM2QCAw9kFgJmDxUBCTEuMyAtIDEuNWQCBA9kFgJmDxUBCTEuNSAtIDEuN2QCBQ9kFgJmDxUBBzEuNyAtIDJkAgYPZBYCZg8VAQcyIC0gMi4zZAIHD2QWAmYPFQEJMi4zIC0gMi41ZAIID2QWAmYPFQEJMi41IC0gMi43ZAIJD2QWAmYPFQEHMi43IC0gM2QCCg9kFgJmDxUBBzMgLSAzLjNkAgsPZBYCZg8VAQkzLjMgLSAzLjVkAgwPZBYCZg8VAQkzLjUgLSAzLjdkAg0PZBYCZg8VAQU%2BIDMuN2QCGQ8WAh8CAg0WGgIBD2QWAmYPFQEBMGQCAg9kFgJmDxUBATBkAgMPZBYCZg8VAQEwZAIED2QWAmYPFQEBMGQCBQ9kFgJmDxUBATBkAgYPZBYCZg8VAQExZAIHD2QWAmYPFQEBMWQCCA9kFgJmDxUBATBkAgkPZBYCZg8VAQEzZAIKD2QWAmYPFQEBNWQCCw9kFgJmDxUBATZkAgwPZBYCZg8VAQEyZAIND2QWAmYPFQEBNGQCHQ8WAh8CAgUWCgIBD2QWAmYPFQEIRnJlc2htZW5kAgIPZBYCZg8VAQlTb3Bob21vcmVkAgMPZBYCZg8VAQZKdW5pb3JkAgQPZBYCZg8VAQpTZW5pb3IgLSAxZAIFD2QWAmYPFQEKU2VuaW9yIC0gMmQCHw8WAh8CAgUWCgIBD2QWAmYPFQEDMTIxZAICD2QWAmYPFQECMzBkAgMPZBYCZg8VAQIzMGQCBA9kFgJmDxUBAjI3ZAIFD2QWAmYPFQECMTNkAiEPD2QPEBYDZgIBAgIWAxYCHwEFAjI1FgIfAQUCMTAWAh8BBQgyMDE0MDA5MBYDZmZmZGQCIw8PZA8QFgJmAgEWAhYCHwEFAjEwFgIfAQUCMjUWAmZmZGQCMQ8PZA8QFgNmAgECAhYDFgIfAQUCMjUWAh8BBQIxMBYCHwEFCDIwMTQwMDkwFgNmZmZkZAIzDw9kDxAWA2YCAQICFgMWAh8BBQIxMBYCHwEFAjI1FgIfAQUIMjAxNDAwOTAWA2ZmZmRkAjUPD2QPEBYDZgIBAgIWAxYCHwEFAjEwFgIfAQUCMjUWAh8BBQgyMDE0MDA5MBYDZmZmZGQCNw8PZA8QFgNmAgECAhYDFgIfAQUCMTAWAh8BBQIyNRYCHwEFCDIwMTQwMDkwFgNmZmZkZAI5Dw9kDxAWA2YCAQICFgMWAh8BBQIxMBYCHwEFAjI1FgIfAQUIMjAxNDAwOTAWA2ZmZmRkGAEFDUdWQWxsU3ViamVjdHMPZ2QP%2FQM4nDCRAfK1t6Bt5A1pVAM1MalUGA65svLx%2BO7mng%3D%3D&__VIEWSTATEGENERATOR=B89A1ECB&__EVENTVALIDATION=%2FwEdAIcBz7HKcfJDCwlgs7diF0sKCXQeDBuIrYucFHElUNNYEE9ZQAnDqcJskEQSIPtpRmyqCKT2BEZHIp45FJkpV7CVnhB%2BgIUKPMZaHItLGP9%2FqiU40T3%2B5zB2%2Fy%2BRPMJglkag3w1jUENciRtgwZkF%2FzxBGXDSLZBcu8rnSs3DgglnassS32Mbcz5tJwcsItvegy%2BAR10Um4c%2B%2FCAAu%2FQDLsm0OfpImBWecU4EV9oH4POHWepEZPg4le2hSM4pWtTpI500Q0xUOZh%2FJaTmXuIHQ6WQCpegdNvczxgwwiZ9QVMU82STqJNeXBSE1X0Xzegoai9olw3Zce33UN1S1TQ74hhUuJODc5Lu2%2Bc%2FiNXlUTJgrQY%2B8S0l27RmzvjKWyqJGxFaZahVTtOjmHklkSlx%2F6KLCdMPbUsX5nikyURSLU8YVY9OYQQMilxHkjR2xR65t4eSotIvzBNHdyQERZsUgqBa5lOjIVKQhDqri8BuZZOF48ZsjjHuhLhgq1pMw2nO%2FsRcVQG7Gju7d74G1dhC4LGzwVo8x9Vv7jpNdlF5jPM8%2B2kDfrurk4%2BeZ62oLsCqyCyLpHJ5dBTBnKrMxqJ%2FxkMu%2Fz80WO5rwAVESmJNOtEgHUxeZ5X3K9FNd51Cw7Sx%2BdnOgMwKI%2BOEUwGhcibo%2BaD1ENiubjlCBJAwiokkxEpaP3XLjey8yGfATF2euOq%2Bij7vuiOqxdNP5ClSqiv%2Fo0%2Bd%2B10NyUjZRFhn54oBX3exURYZplpZgh6UUk78rYsxrdOC54e98RN7nXu%2BNk%2FxD8QZI8TuDpFsJOMbPwweEjKQ%2BDzaol4a5PtPgEUGP2zOjAkv5cuYydOweewVKBuEItX0Div9z98laqWAP%2Frvr0cJqpnHFYV%2BJ9LpCcXAg%2FeLd8BwTgs8kiM1%2FiqgwNoRjEiyI5i%2F8MubhLjXT%2BfpfdYC9dFU6mcqd7NwT5HeFZelLpuAxxY8EQdKLCJ6na1GNqGMVsoCOjO63VM0KOc55FPae7QFJDq%2F3Dcc0avFgigM%2FUaJZjM39thRJjIMgb7maeS1lUKPAreaK5hx5HrO7PtCpIBtKL7ka0z8fdgj0baSexaesMtWlJ%2FfPRbjqcFUGROckklMm7YGgFFiuqKoShyxQbsfw9IaHYD5YNcie7IlBmbP5N3MnOMp4nvwDC3bMhXFCByZ431tmLQaaj9UFtavlpW7LzBTjQW%2BoFa4bD2i2yr96ft1tJ9xHKfjCVny35JBsaoy1QPPAOUZQnoP5KvuJyNYNj9MgsGDF5Q8x0bwtnx%2Fs7QXVpnTYeVh7V4AF%2BekGxXid%2FQWzJWvq0jDCKf7ef9BYZwMTrLAlFFA6HwDPJ7%2FjGGxv8bvcyp2MZ2UJQf2VxXiCkNHq%2Bj6STeyVucLK0mxwwg479BtqxLvm2f9OV9RZqE9sps5zCIHg4GHg3SF1ww89tMlYCHYABc0OwwQrlmFY0H0MkRYhl8WIw5GkGMRJgGQOvOPXa88NZ8aRiD9IHU4%2FZjSANSb0efLFck1GsmWx7FoUmWgHDhwjNEuHhhMbRw284ISuSkLumVvvJxh%2FnwhIRynGjGOGeTmrDGF0ZUUek1HNgVQX7x7Hh5DbPlCmtD9a6Td6lPc2hLLIBUgDgDMvQt9RjjDPSx7GeJLNdXLy146eHWyEx4sPgrnkf%2FkXqvdOX%2FmjswKJ2GN8qz1rbZpKnQpvwA%2FqvNAw1aeM2k3xui0YIt5xPHlvLzJf0HP5GzrEZXgtL%2FhmLZxT%2BtpZe8ByUgMa7JqNBOcwqyVnkD5e%2BmT7LJt4n0%2BeN66N1LGduG73BF7sgZjwfpwYb%2FOPI8ksZjAFbTJw3BPZn326izrqGH8zHPLPyApbYW6Ar%2FMTxlLdAflxTIzjOuNBCAF%2BDWlMPfLdlFkRYiBJDrM%2BUnjDErb5oCWxSMvxuOdE9Yun%2BnlM4naRUjfqNv%2BQAD%2BOUBi00UCu5ZAxEu8deMhmmuZKULClhLkevM%2BBz899lMGA21aFoyU3A0zCt1kQ6JoPH%2Bj%2F%2BZgYFK3lep0EjqCh2hm8YuI7TGt20iDp%2FhDpuKRMppaX0ZdJHIx2B2C53izYWmxRreYfRGW0HmB07tb0PD6jBvVxb%2FdiMybDm6w6sbjcLejYrlCjmFWg3Y9avwoa9rvepCpXUesiy6%2BW6%2F%2FEahT1opiY0aPrLnK%2BDu7rrcpBZa4reMDSSrZzczKhPUwojWWGy3Yuxl%2BKmchViKMprDWOcVcP2PBt6VFfBL4JLUJEm5j%2FOwgMCK0Y2z2klT4SdW2NfuQfQ6aK4W%2FNdGgBS%2BQpX6Iyp6vUSlNcMgK3MSirjeLFMbAdxeLqWIIY8IZb1M3HEUs5kZuNB%2F0f4I4My1maqspEcIosCyDM4SossLKzNNGwoHBSwYfJnEPbXRCChvVR8xVr02gosiACvTELpG6wKlwi1bdeFXiz5BGH2Hmz1hofCA0nV5uR6XFTw59WyACjoglC1O%2BeLGtFYVfqqy3J%2B5vpDkvUizZU8R2prbssS9Oovh9lxYd0r%2BG%2FhmePg8RlePY6HnZT9Tlw%2BImjVWR8XLoMC16D8q1QXeZpWJiF7khrXeEv0jFawjE57BHk1tDhddWZfvEF9cQ0BGhUuckmmOGZ90RalIpNZgJICaoZm5TPO5l%2BJwzCkq73jcJRuttHn%2BL9DISv2EffoKljfMEMPTLxCjrcbopNiNwrRmzbmYoHrEPHenbM6WkC4caRDxiSfSZ5Sblm7H7hkI8D1OAMaQqIK8XihHsL02pkgdEPIUhQv8ncCJuxVwcgz0SUEdurWR0im1qK%2FXZJLtYYf9q9YHB4s2intZ6pGO8Jua8DUubf9McKs3SJ%2FAbAYjMjhOyTnPq7woZ0FykglirvewZs5gpbDq3KAh4MIezFlAg9sZuZ76vzcFcZoTOatZzCvpBFp7%2FzONNrAG%2FB1SoHdU%3D&__ASYNCPOST=true${showAll?'&ButShowAllSubjects=Show%20All%20Subjects':''}`;

    req_headers = {
        'Host': 'chreg.eng.cu.edu.eg',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Origin': 'http://chreg.eng.cu.edu.eg',
        'X-MicrosoftAjax': 'Delta=true',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
        'Referer': 'http://chreg.eng.cu.edu.eg/chsresultstatistics.aspx?s=1'
    };

    const req =  {
        method: 'POST',
        headers: req_headers,
        body: formString
    };

    const res = await fetch('http://chreg.eng.cu.edu.eg/chsresultstatistics.aspx?s=1', req);
    const html = await res.text();
    const dom = new jsdom.JSDOM(html);
    const document = dom.window.document
    return {doc: document, html: html};
}

function for_loop_remove_first(iterate) {
    let val = [];
    for (itr of iterate) {
        val.push(itr.textContent.replace('\n', '').trim());
    }
    val.shift();
    val = val.map(num => parseInt(num));
    return val;
}

function get_data_from_document(document) {
    let gpaStat = document.getElementsByTagName('tbody')[2];
    gpaStat = gpaStat.getElementsByTagName('tr')[1];
    gpaStat = gpaStat.getElementsByTagName('td');
    const gpaStatVal = for_loop_remove_first(gpaStat);

    let progStat = document.getElementsByTagName('tbody')[4];
    progStat = progStat.getElementsByTagName('tr')[1];
    progStat = progStat.getElementsByTagName('td');
    const progStatVal = for_loop_remove_first(progStat);
    return {gpa_stat: gpaStatVal, prog_stat: progStatVal};
}

function write_to_file(directory, fileName, data) {
    const fileDirectory = `${directory}/${fileName}.json`;
    const writeData = JSON.stringify(data);
    fs.writeFileSync(fileDirectory, writeData);
}

function get_list_by_id(document, id) {
    const res = document.getElementById(id).getElementsByTagName('option')
    return res;
}

function read_all_subject_rows(doc) {
    const table = doc.getElementById('GVAllSubjects');
    const rows = table.getElementsByTagName('tr');
    let stats = [];
    for (row of rows) {
        cells = row.getElementsByTagName('td');
        let entry = {};
        let i=0;
        for(cell of cells) {
            text = cell.textContent.trim();
            switch (i) {
                case 0:
                    entry.course_level = parseInt(text);
                    break;
                case 1:
                    entry.course_code = text;
                    break;
                case 2:
                    entry.course_name = text;
                    break;
                case 3:
                    entry.Astar = parseInt(text);
                    break;
                case 4:
                    entry.A = parseInt(text);
                    break;
                case 5:
                    entry.Aminus = parseInt(text);
                    break;
                case 6:
                    entry.Bplus = parseInt(text);
                    break;
                case 7:
                    entry.B = parseInt(text);
                    break;
                case 8:
                    entry.Bminus = parseInt(text);
                    break;
                case 9:
                    entry.Cplus = parseInt(text);
                    break;
                case 10:
                    entry.C = parseInt(text);
                    break;
                case 11:
                    entry.Cminus = parseInt(text);
                    break;
                case 12:
                    entry.Dplus = parseInt(text);
                    break;
                case 13:
                    entry.D = parseInt(text);
                    break;
                case 14:
                    entry.F = parseInt(text);
                    break;
                case 15:
                    entry.All = parseInt(text);
                    break;
                case 16:
                    entry.AstarToCplus = parseInt(text);
                    break;
                case 17:
                    entry.CToD = parseInt(text);
                    break;  
                case 18:
                    entry.Fonly = parseInt(text);
                    break;        
            }
            i++;
        }
        stats.push(entry);
    }
    return stats;
}

async function get_statistics(directory, fileName) {
    const res = await get_statistics_first();
    const terms = get_list_by_id(res.doc, 'lstTerm');
    let entries = [];
    for (term of terms) {
        termS = term.textContent.trim(); termV = parseInt(term.value);
        console.log(termS, termV);
        const res1 = await get_all_stats(termV, 23);
        const progs = get_list_by_id(res1.doc, 'lstProg')
        for (prog of progs) {
            programS = prog.textContent.trim(); programV = parseInt(prog.value);
            console.log(programS, programV);
            if (programV === 0) continue;
            const res2 = await get_all_stats(termV, programV, true);
            let data, stats;
            let obtained = false;
            try {
                data = get_data_from_document(res2.doc);
                stats = read_all_subject_rows(res2.doc);
                obtained = true;
            } catch(err) {
                data = [];
                stats = [];
            }

            entry = {
                term: {termV: termV, termS: termS},
                program: {programV: programV, programS: programS},
                obtained: obtained,
                data: data,
                stats: stats
            }
            entries.push(entry);
            write_to_file(directory, fileName, entries);
        }
    }
} 


module.exports = get_statistics