const jsdom = require("jsdom");
const fs = require('fs');

async function get_statistics_html(term=null, prog = null, sub = null) {

    
    formString = `lstTerm=${term}&lstProg=${prog===null?23:prog}&lstSubject=${sub===null?0:sub}`;
    formString += '&ScriptManager1=UpdatePanel1%7ClstProg&__EVENTTARGET=lstProg&__EVENTARGUMENT=&__LASTFOCUS=&__VIEWSTATE=%2FwEPDwUIMTQ3MTg5OTUPZBYCAgMPZBYCAgMPZBYCZg9kFigCAQ8QDxYCHgtfIURhdGFCb3VuZGdkEBUxCUZhbGwgMjAyMgtTdW1tZXIgMjAyMgtTcHJpbmcgMjAyMglGYWxsIDIwMjELU3VtbWVyIDIwMjELU3ByaW5nIDIwMjEJRmFsbCAyMDIwC1N1bW1lciAyMDIwC1NwcmluZyAyMDIwCUZhbGwgMjAxOQtTdW1tZXIgMjAxOQtTcHJpbmcgMjAxOQlGYWxsIDIwMTgLU3VtbWVyIDIwMTgLU3ByaW5nIDIwMTgJRmFsbCAyMDE3C1N1bW1lciAyMDE3C1NwcmluZyAyMDE3CUZhbGwgMjAxNgtTdW1tZXIgMjAxNgtTcHJpbmcgMjAxNglGYWxsIDIwMTULU3VtbWVyIDIwMTULU3ByaW5nIDIwMTUJRmFsbCAyMDE0C1N1bW1lciAyMDE0C1NwcmluZyAyMDE0CUZhbGwgMjAxMwtTdW1tZXIgMjAxMwtTcHJpbmcgMjAxMwlGYWxsIDIwMTILU3VtbWVyIDIwMTILU3ByaW5nIDIwMTIJRmFsbCAyMDExC1N1bW1lciAyMDExC1NwcmluZyAyMDExCUZhbGwgMjAxMAtTdW1tZXIgMjAxMAtTcHJpbmcgMjAxMAlGYWxsIDIwMDkLU3VtbWVyIDIwMDkLU3ByaW5nIDIwMDkJRmFsbCAyMDA4C1N1bW1lciAyMDA4C1NwcmluZyAyMDA4CUZhbGwgMjAwNwtTdW1tZXIgMjAwNwtTcHJpbmcgMjAwNwlGYWxsIDIwMDYVMQI0OQI0OAI0NwI0NgI0NQI0NAI0MwI0MgI0MQI0MAIzOQIzOAIzNwIzNgIzNQIzNAIzMwIzMgIzMQIzMAIyOQIyOAIyNwIyNgIyNQIyNAIyMwIyMgIyMQIyMAIxOQIxOAIxNwIxNgIxNQIxNAIxMwIxMgIxMQIxMAE5ATgBNwE2ATUBNAEzATIBMRQrAzFnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnFgFmZAIFDxAPFgIfAGdkEBUUJFtTRUVdIFN1c3RhaW5hYmxlIEVuZXJneSBFbmdpbmVlcmluZypbTUVNXSBNYW51ZmFjdHVyaW5nIEVuZ2luZWVyaW5nJiBNYXRlcmlhbHMpW0lFTV0gSW5kdXN0cmlhbCBFbmdpbmVlcmluZyAmIE1hbmFnZW1lbnQeW01FRV0gTWVjaGF0cm9uaWNzIEVuZ2luZWVyaW5nK1tIRU1dIEhlYWx0aGNhcmUgRW5naW5lZXJpbmcgYW5kIE1hbmFnZW1lbnQmW0NJRV0gQ2l2aWwgSW5mcmFzdHJ1Y3R1cmUgRW5naW5lZXJpbmcjW0VFRV0gRWxlY3RyaWNhbCBFbmVyZ3kgRW5naW5lZXJpbmcuW1BQQ0NdIFBldHJvbGV1bSBhbmQgUGV0cm9jaGVtaWNhbCBFbmdpbmVlcmluZy5bUFBDUF0gUGV0cm9sZXVtIGFuZCBQZXRyb2NoZW1pY2FsIEVuZ2luZWVyaW5nKFtXRUVdIFdhdGVyIEVuZ2luZWVyaW5nIGFuZCBFbnZpcm9ubWVudCAtW0NDRUVdIENvbW11bmljYXRpb24gYW5kIENvbXB1dGVyIEVuZ2luZWVyaW5nLVtDQ0VDXSBDb21tdW5pY2F0aW9uIGFuZCBDb21wdXRlciBFbmdpbmVlcmluZxxbU1RFXSBTdHJ1Y3R1cmFsIEVuZ2luZWVyaW5nL1tBRU1dIEFlcm9uYXV0aWNhbCBFbmcuIGFuZCBBdmlhdGlvbiBNYW5hZ2VtZW50I1tNREVdIE1lY2hhbmljYWwgRGVzaWduIEVuZ2luZWVyaW5nLltBRVRdIEFyY2hpdGVjdHVyYWwgRW5naW5lZXJpbmcgYW5kIFRlY2hub2xvZ3ktW1BQQ10gUGV0cm9sZXVtIGFuZCBQZXRyb2NoZW1pY2FsIEVuZ2luZWVyaW5nLVtDRU1dIENvbnN0cnVjdGlvbiBFbmdpbmVlcmluZyBhbmQgTWFuYWdlbWVudCxbQ0NFXSBDb21tdW5pY2F0aW9uIGFuZCBDb21wdXRlciBFbmdpbmVlcmluZwxBbGwgUHJvZ3JhbXMVFAIyMwIyMgIyMQIyMAIxOQIxOAIxNwIxMwIxMgIxMQIxMAE5ATgBNwE1ATQBMwEyATEBMBQrAxRnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2RkAgcPD2QPEBYBZhYBFgIeDlBhcmFtZXRlclZhbHVlBQExFgECBGRkAgkPEA8WAh8AZ2QQFTUMQWxsIFN1YmplY3RzEUNIRU4wMDE6Q2hlbWlzdHJ5GUNWRU4xMjU6Q2l2aWwgRW5naW5lZXJpbmcsRVBNTjEwMTpFbGVjdHJpY2FsIEVuZ2luZWVyaW5nIEZ1bmRhbWVudGFscyAeRVBNTjIwMjpFbGVjdHJpYyBEcml2ZSBTeXN0ZW1zKkdFTk4wMDE6SGlzdG9yeSBvZiBTY2llbmNlIGFuZCBFbmdpbmVlcmluZyBHRU5OMDAzOkJhc2ljIEVuZ2luZWVyaW5nIERlc2lnbh9HRU5OMDA0OkNvbXB1dGVycyBmb3IgRW5naW5lZXJzGUdFTk4wMDU6VGVjaG5pY2FsIFdyaXRpbmciR0VOTjEwMjpGdW5kYW1lbnRhbHMgb2YgTWFuYWdlbWVudC1HRU5OMjAxOkNvbW11bmljYXRpb24gYW5kIFByZXNlbnRhdGlvbiBTa2lsbHMnR0VOTjIxMDpSaXNrIE1hbmFnZW1lbnQgYW5kIEVudmlyb25tZW50MUdFTk4yMjQ6RnVuZGFtZW50YWxzIG9mICBFY29ub21pY3MgYW5kIEFjY291bnRpbmcZR0VOTjMwMzpDcml0aWNhbCB0aGlua2luZyBHRU5OMzEwOkFkdmFuY2VkIFJpc2sgTWFuYWdlbWVudBhHRU5OMzIxOkZvcmVpZ24gTGFuZ3VhZ2URR0VOTjMyNjpNYXJrZXRpbmcmR0VOTjMyNzpTZWxlY3Rpb25zIG9mIExpZmUgTG9uZyBTa2lsbHMjR0VOTjMyODpTY2llbnRpZmljIFJlc2VhcmNoIE1ldGhvZHMaR0VOTjMzMjpTZXJ2aWNlIE1hbmFnZW1lbnQWTUNOTjEwMTpUaGVybW9keW5hbWljcxVNQ05OMzI2OkhlYXQgVHJhbnNmZXIeTUNOTjMyNzpIZWF0IGFuZCBNYXNzIFRyYW5zZmVyGE1EUE4xMzI6TWF0ZXJpYWwgU2NpZW5jZRhNRFBOMTYxOlN0cmVzcyBBbmFseXNpcyAkTURQTjI1MDpGdW5kYW1lbnRhbHMgb2YgTWVjaGF0cm9uaWNzGk1EUE40MjQ6UHJvamVjdCBNYW5hZ2VtZW50Hk1FQ04wMDI6TWVjaGFuaWNzLTIgKER5bmFtaWNzKSdNRVBOMjAyOkZ1bmRhbWVudGFscyBvZiBGbHVpZCBNZWNoYW5pY3MqTUVQTjIwMzpGdW5kYW1lbnRhbHMgb2YgQ29tYnVzdGlvbiBTeXN0ZW1zJE1FUE4yMjQ6SW50ZXJtZWRpYXRlIEZsdWlkIE1lY2hhbmljczxNRVBOMzAxOkludGVybmFsIENvbWJ1c3Rpb24gRW5naW5lcyAoVGhlb3J5IGFuZCBEZXZlbG9wbWVudCkeTUVQTjQwMzpIZWF0IEV4Y2hhbmdlcnMgRGVzaWduFk1FUE40MDQ6TnVjbGVhciBFbmVyZ3k2TUVQTjQwNTpBcHBsaWVkIENvbnRyb2wgVGVjaG5vbG9naWVzIGZvciBFbmVyZ3kgU3lzdGVtFE1FUE40MTQ6QWR2YW5jZWQgQ0ZEGE1FUE40MTU6UG93ZXIgR2VuZXJhdGlvbjdNRVBONDE2OkFpciBhbmQgV2F0ZXIgUG9sbHV0aW9uIGFuZCBRdWFsaXR5IE1vbml0b3JpbmcgSk1FUE40MjE6QWlyIENvbmRpdGlvbmluZyBEZXNpZ24sIFNlbGVjdGlvbiwgT3BlcmF0aW9uIGFuZCBUcm91YmxlIHNob290aW5nJU1FUE40MzM6TGFib3JhdG9yeSBvZiBFbmVyZ3kgU3lzdGVtcy4aTUVQTjQ0NDpFbmVyZ3kgRWZmaWNpZW5jeSAbTUVQTjQ0NjpUdXJiby1tYWNoaW5lcnktSUkgGk1FUE40NzI6QXV0b21hdGljIENvbnRyb2wgPE1USE4wMDE6SW50cm9kdWN0aW9uIHRvIExpbmVhciBBbGdlYnJhIGFuZCBBbmFseXRpYyBHZW9tZXRyeRNNVEhOMDAzOkNhbGN1bHVzIElJMU1USE4xMDI6TXVsdGl2YXJpYWJsZSBDYWxjdWx1cyBhbmQgTGluZWFyIEFsZ2VicmEeTVRITjEwMzpEaWZmZXJlbnRpYWwgRXF1YXRpb25zGk1USE4yMDE6TnVtZXJpY2FsIEFuYWx5c2lzIk1USE4yMDM6UHJvYmFiaWxpdHkgYW5kIFN0YXRpc3RpY3MhUEhZTjAwMjpFbGVjdHJpY2l0eSBhbmQgTWFnbmV0aXNtG1NFRU4yODA6RW5naW5lZXJpbmcgU2VtaW5hch1TRUVOMjgxOkluZHVzdHJpYWwgVHJhaW5pbmctMR5TRUVONDgwOkdyYWR1YXRpb24gUHJvamVjdCAoSSkVNQEwCDIwMTkwMDYxCDIwMTkwMTI4CDIwMTkwMTYxCDIwMTkwMTYzCDIwMTkwMTY2CDIwMTkwMTY4CDIwMTkwMTY5CDIwMTkwMTcwCDIwMTkwMTcxCDIwMTkwMTcyCDIwMTkwMTc0CDIwMTkwNDkyCDIwMTkwNDkzCDIwMTkwNDU1CDIwMTkwMTc4CDIwMTkwMTc5CDIwMTkwMTgwCDIwMTkwNDk1CDIwMTkwMTgxCDIwMTkwMjI1CDIwMTkwMjI4CDIwMTkwNjY3CDIwMTkwNDkwCDIwMTkwMjM5CDIwMTkwNjY4CDIwMTkwMjU4CDIwMTkwMjczCDIwMTkwNjcxCDIwMTkwNjcyCDIwMTkwNjczCDIwMTkwNjc2CDIwMTkwNjg1CDIwMTkwNjg2CDIwMTkwNjg3CDIwMTkwNjk1CDIwMTkwMjc2CDIwMTkwNjk2CDIwMTkwNjk5CDIwMTkwNzAzCDIwMTkwNzA0CDIwMTkwNzM1CDIwMTkwNzA1CDIwMTkwMjgyCDIwMTkwMjg0CDIwMTkwMjg1CDIwMTkwMjg2CDIwMTkwMjg4CDIwMTkwMjg5CDIwMTkwMzMyCDIwMTkwNjc0CDIwMTkwNjc1CDIwMTkwNzA3FCsDNWdnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZGQCCw8PZA8QFgJmAgEWAhYCHwEFAjQ5FgIfAQUCMjMWAmZmZGQCDQ8WAh4LXyFJdGVtQ291bnQCDRYaAgEPZBYCZg8VAQpQUCAgICAgICAgZAICD2QWAmYPFQEKQSsgICAgICAgIGQCAw9kFgJmDxUBCkEgICAgICAgICBkAgQPZBYCZg8VAQpBLSAgICAgICAgZAIFD2QWAmYPFQEKQisgICAgICAgIGQCBg9kFgJmDxUBCkIgICAgICAgICBkAgcPZBYCZg8VAQpCLSAgICAgICAgZAIID2QWAmYPFQEKQysgICAgICAgIGQCCQ9kFgJmDxUBCkMgICAgICAgICBkAgoPZBYCZg8VAQpDLSAgICAgICAgZAILD2QWAmYPFQEKRCsgICAgICAgIGQCDA9kFgJmDxUBCkQgICAgICAgICBkAg0PZBYCZg8VAQpGICAgICAgICAgZAIPDxYCHwICDRYaAgEPZBYCZg8VAQEwZAICD2QWAmYPFQEBMGQCAw9kFgJmDxUBATBkAgQPZBYCZg8VAQEwZAIFD2QWAmYPFQEBMGQCBg9kFgJmDxUBATBkAgcPZBYCZg8VAQEwZAIID2QWAmYPFQEBMGQCCQ9kFgJmDxUBATBkAgoPZBYCZg8VAQEwZAILD2QWAmYPFQEBMGQCDA9kFgJmDxUBATBkAg0PZBYCZg8VAQEwZAITDzwrABECARAWABYAFgAMFCsAAGQCFQ8PZA8QFgJmAgEWAhYCHwFlFgIfAWUWAmZmZGQCFw8WAh8CAg0WGgIBD2QWAmYPFQEDPCAxZAICD2QWAmYPFQEHMSAtIDEuM2QCAw9kFgJmDxUBCTEuMyAtIDEuNWQCBA9kFgJmDxUBCTEuNSAtIDEuN2QCBQ9kFgJmDxUBBzEuNyAtIDJkAgYPZBYCZg8VAQcyIC0gMi4zZAIHD2QWAmYPFQEJMi4zIC0gMi41ZAIID2QWAmYPFQEJMi41IC0gMi43ZAIJD2QWAmYPFQEHMi43IC0gM2QCCg9kFgJmDxUBBzMgLSAzLjNkAgsPZBYCZg8VAQkzLjMgLSAzLjVkAgwPZBYCZg8VAQkzLjUgLSAzLjdkAg0PZBYCZg8VAQU%2BIDMuN2QCGQ8WAh8CAg0WGgIBD2QWAmYPFQEBMWQCAg9kFgJmDxUBATFkAgMPZBYCZg8VAQExZAIED2QWAmYPFQEBNWQCBQ9kFgJmDxUBAjEzZAIGD2QWAmYPFQECMjhkAgcPZBYCZg8VAQIxMmQCCA9kFgJmDxUBAjEyZAIJD2QWAmYPFQECMjZkAgoPZBYCZg8VAQIxNmQCCw9kFgJmDxUBATdkAgwPZBYCZg8VAQE1ZAIND2QWAmYPFQEBM2QCHQ8WAh8CAgUWCgIBD2QWAmYPFQEIRnJlc2htZW5kAgIPZBYCZg8VAQlTb3Bob21vcmVkAgMPZBYCZg8VAQZKdW5pb3JkAgQPZBYCZg8VAQpTZW5pb3IgLSAxZAIFD2QWAmYPFQEKU2VuaW9yIC0gMmQCHw8WAh8CAgUWCgIBD2QWAmYPFQECMTdkAgIPZBYCZg8VAQI0NmQCAw9kFgJmDxUBAjI5ZAIED2QWAmYPFQECMjhkAgUPZBYCZg8VAQEyZAIhDw9kDxAWA2YCAQICFgMWAh8BBQI0ORYCHwEFAjIzFgIfAQUBMBYDZmZmZGQCIw8PZA8QFgJmAgEWAhYCHwEFAjIzFgIfAQUCNDkWAmZmZGQCMQ8PZA8QFgNmAgECAhYDFgIfAQUCNDkWAh8BBQIyMxYCHwEFATAWA2ZmZmRkAjMPD2QPEBYDZgIBAgIWAxYCHwEFAjIzFgIfAQUCNDkWAh8BBQEwFgNmZmZkZAI1Dw9kDxAWA2YCAQICFgMWAh8BBQIyMxYCHwEFAjQ5FgIfAQUBMBYDZmZmZGQCNw8PZA8QFgNmAgECAhYDFgIfAQUCMjMWAh8BBQI0ORYCHwEFATAWA2ZmZmRkAjkPD2QPEBYDZgIBAgIWAxYCHwEFAjIzFgIfAQUCNDkWAh8BBQEwFgNmZmZkZBgBBQ1HVkFsbFN1YmplY3RzD2dkKfSG1Sxr1gyDZCpVXSFZJYGueUpoOYtqbGRfqvGmjI4%3D&__VIEWSTATEGENERATOR=B89A1ECB&__EVENTVALIDATION=%2FwEdAH9YQ93O1RO3L7iITjoErqdTdB4MG4iti5wUcSVQ01gQT1lACcOpwmyQRBIg%2B2lGbKoIpPYERkcinjkUmSlXsJWeEH6AhQo8xloci0sY%2F3%2BqJTjRPf7nMHb%2FL5E8wmCWRqDfDWNQQ1yJG2DBmQX%2FPEEZcNItkFy7yudKzcOCCWdqyxLfYxtzPm0nBywi296DL4BHXRSbhz78IAC79AMuybQ5%2BkiYFZ5xTgRX2gfg84dZ6kRk%2BDiV7aFIzila1OkjnTRDTFQ5mH8lpOZe4gdDpZAKl6B029zPGDDCJn1BUxTzZJOok15cFITVfRfN6ChqL2iXDdlx7fdQ3VLVNDviGFS4k4Nzku7b5z%2BI1eVRMmCtBj7xLSXbtGbO%2BMpbKokbEVplqFVO06OYeSWRKXH%2FoosJ0w9tSxfmeKTJRFItTxhVj05hBAyKXEeSNHbFHrm3h5Ki0i%2FME0d3JARFmxSCoFrmU6MhUpCEOquLwG5lk4XjxmyOMe6EuGCrWkzDac7%2BxFxVAbsaO7t3vgbV2ELgsbPBWjzH1W%2FuOk12UXmM8zz7aQN%2Bu6uTj55nraguwKrILIukcnl0FMGcqszGon%2FGQy7%2FPzRY7mvABURKYk060SAdTF5nlfcr0U13nULDtLH52c6AzAoj44RTAaFyJuj5oPUQ2K5uOUIEkDCKiSTESlo%2FdcuN7LzIZ8BMXZ646r6KPu%2B6I6rF00%2FkKVKqK%2F%2BjT537XQ3JSNlEWGfnigFfd7FRFhmmWlmCHpRSTvytizGt04Lnh73xE3ude742T%2FEPxBkjxO4OkWwk4xs%2FDB4SMpD4PNqiXhrk%2B0%2BARQY%2FbM6MCS%2Fly5jJ07B57BUoG4Qi1fQOK%2F3P3yVqpYA%2F%2Bu%2BvRwmqmccVhX4n0ukJxcCD94t3wHBOCzySIzX%2BKqDA2hGMSLIjmL%2Fwy5uEuNdP5%2Bl91gL10VTqZyp3s3BPkd4Vl6Uum4DHFjwRB0osInqdrUY2oYxWygI6M7rdUzQo5znkU9p7tAUkOr%2FcNxzRq8WCKAz9RolmMzf22FEmMgyBvuZp5LWVQo8Ct5ormHHkes7s%2B0KkgG0ovuRrTPx92CPRtpJ7Fp6wy1aUn989FuOpwVQZE5ySSUybtgaAUWK6oqhKHLFBux%2FD0hodgPlg1yJ7siUGZs%2Fk3cyc4ynie%2FAMLdsyFcUIHJnjfW2YtBpqP1QW1q%2BWlbsvMFONBb6gVrhsPaLbKv3p%2B3W0n3Ecp%2BMJWfLfkkGxqjLVA88A5RlCeg%2Fkq%2B4nI1g2P0yCwYMXlDzHRvC2fH%2BztBdWmdNh5WHtXgAX56QbFeJ39BbMla%2BrSMMIp%2Ft5%2F0FhnAxOssCUUUDofAM8nv%2BMYbG%2Fxu9zKnYxnZQlB%2FZXFeIKQ0er6PpJN7JW5wsrSbHDCDjv0G2rEu%2BbZ%2F05X1FmoT2ymznMIgeDgYeDdIXXDDz20yVgIdgAFzQ7DBCuWYVjQfQyRFiGXxYjDkaQYxEmAZA6849drzw1nxpGIP0gdTj9mNIA1JvR58sVyTUayZbHsWhSZaAcOHCM0S4eGExtHDbzghK5KQu6ZW%2B8nGH%2BfCEhHKcaMY4Z5OasMYXRlbtNmfoPTnf1ldc%2FMDVpniMrmRMmQ6fbwjRPxxmXav9yt9hyCpuyGCk4xfhxsFWbvfmJc7Yg1AXfwASQ93IenCzwBKxameIbcJ8P3Zdjq4C0ZPq9Zv7C1ZD9YtIentgkhNAkjizLGCiy419n4V23rxVcsEO2krh9jJpvRxjXNBVjzhENzZKlRT1J9O5aPjjqzDbczc5Ma5zaSnVbyXpy0wnapwpbFt%2F4%2B21yW1zhvq5ZGzZzRPBA90%2Bl9YlyoCx%2FwyOI4XkcZi13qBK6a2hkP5VXbKkdmQL6bFVkFkWzziWGOS%2F7ryI6MrtmpLdXx3%2Fs4DxRH%2B%2BdkNhRx3ErrgemnnHM4ult55eY6Uv8VT0CxHqKW9JXmvjMVw83OxoE64CftMSWQrYret4BtP%2BxoLURnZPG4OKNew%2Bn8rGoIM82tqu8Xh21TgqPvUuW6dkEuXZGG%2FTnBHp9VYU5LbmtB8tuDfy10b6Ap9QWh8HWN8vQo1rI4j3MnEYhNQgx9BChOmqQQ4BRxf1jwKHKtSmtyXwYCBNId4eBXyW7tzzDp8GbmbIIE%2Bl1ldRRzJnJkDeIk9aGQojCvmeT8vY7yRS94vmaXz1dSwizKnbTn06s8Obdz9X1Q1lMpLwqqD3%2FgPJvz0I5hzXnCSMDfnFNVaLFehVOjIr7rZ4JgO6kXQSQNil0O71P9uqsdP%2F9IYfHwDO4k4KcVGJzS91k5jQUsfXoJKk6l0mRVPOxHjnHwqGm8i0Y5R9dL0NKK1M7L9LCsUnfJ6saIu2Dg3VmkgPSkg6XHZXTO6B83iJ1Oq4demXATYz2%2FCjeWnnRoae8jduKHWhP6QGYxUioNr5m7CKjjNvLV4uTLUJBeNc4sOdlIuobwJ6ruGWIaFrwP2AsGvzYtUQtdZWAGurSVUDig2GSL076evPRAatlUsQEy0xOXKLBk%2FmzC2%2BL%2FhhKnwLOesqwPJmrRB%2Bj%2Bhsu9TZ4gJPfY3qSVY9BK3OOJYNVFqvtRdbblBEbe6nvmFitXmhKAe0OWYo2GE9yZPecMZC4PnHjTKJSsdJIijgqeoo1kIi%2FsZBni0kWM364uizjKBofmj0KdffDkDXpoBVIwIqv74s5uBSdhfAzYAcZs5gpbDq3KAh4MIezFlAg%2BP90CZqMzK3W%2B7rYPdEx0PNpJDMUrTJvXu9ecvWA3Po%3D&__ASYNCPOST=true&';

    if(term===null) {
        formString = '';
    }
    req_headers = {
        'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8',
        'X-MicrosoftAjax' : 'Delta=true',
        'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'
    };

    const req =  {
        method: 'POST',
        headers: req_headers,
        body: formString
    };

    const res = await fetch('http://chreg.eng.cu.edu.eg/chsresultstatistics.aspx?s=1', req);
    const html = await res.text();
    return html
}

function for_loop_exception(iterate, exception) {
    let val = [];
    for (itr of iterate) {
        check = itr.textContent.replace('\n', '').trim();
        if (check !== exception) {
            val.push(parseInt(check));
        }
    }
    return val;
}

function get_data_from_dom(document) {
    const tbody = document.getElementsByTagName('tbody')[0];

    let grades = tbody.getElementsByTagName('tr')[3];
    grades = grades.getElementsByTagName('tr')[1];
    grades = grades.getElementsByTagName('td');
    const gradesVal = for_loop_exception(grades, 'No of Students');

    let gpaStat = tbody.getElementsByTagName('tr')[7];
    gpaStat = gpaStat.getElementsByTagName('tr')[1];
    gpaStat = gpaStat.getElementsByTagName('td');
    const gpaStatVal = for_loop_exception(gpaStat, 'Students Count');

    let progStat = tbody.getElementsByTagName('tr')[14];
    progStat = progStat.getElementsByTagName('td');
    const progStatVal = for_loop_exception(progStat, 'No of Students');

    return {grades: gradesVal, gpa_stat: gpaStatVal, prog_stat: progStatVal};
}

function append_to_file(directory, fileName, data) {
    const fileDirectory = `${directory}/${fileName}.json`;
    let file = fs.readFileSync(fileDirectory);
    file = JSON.parse(file);
    file.push(data);
    file = JSON.stringify(file)
    fs.writeFileSync(fileDirectory, file);
}

async function get_statistics(directory, fileName) {
    const string = await get_statistics_html();
    const dom = new jsdom.JSDOM(string);
    const document = dom.window.document;
    let terms = document.getElementById('lstTerm').getElementsByTagName('option');
    let entries = [];
    let not_obtained = [];
    for (term of terms) {
        termS = term.textContent;
        termV = term.value;
        const html = await get_statistics_html(termV);
        const dom2 = new jsdom.JSDOM(html);
        const document2 = dom2.window.document;
        const progs = document2.getElementById('lstProg').getElementsByTagName('option')

        for (prog of progs) {
            program = prog.textContent;
            programV = prog.value;
            const html2 = await get_statistics_html(termV, programV);
            const dom3 = new jsdom.JSDOM(html2);
            const document3 = dom3.window.document;
            const subs = document3.getElementById('lstSubject').getElementsByTagName('option');
            for (sub of subs) {
                subV = sub.value
                let html3 = await get_statistics_html(termV, programV, sub.value);
                const dom4 = new jsdom.JSDOM(html3);
                const document4 = dom4.window.document;
                let data = null
                try {
                    data = get_data_from_dom(document4);
                    entry = {
                        term: termS, 
                        program: program, 
                        subject: sub.textContent.replace('\n', '').trim(), 
                        data: data
                    }
    
                    append_to_file(directory, fileName, entry)
                    console.log(entry)
                    entries.push(entry);
                } catch(err) {
                    not_obtained.push({
                        html: html3,
                        term: [termV, termS],
                        program: [programV, program],
                        subject: [subV, sub.textContent]
                    });
                }
            }
        }
    } 
    fs.writeFileSync(`${directory}/${fileName}_n.json`, not_obtained);
    return entries;
}
      

module.exports = get_statistics