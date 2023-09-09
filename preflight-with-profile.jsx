/* 
 * USAGE 
 * Run from the command line using sampleclient.exe that comes with InDesign Server
 * Make sure InDesign Server is running at the address and port you spcifiy in the -host parameter
 * 
 * > sampleclient -host localhost:18383 <file path>\\preflight-with-profile.jsx indesignFilePath="<file path>\\<filename>.indd|idml"
 * 
 * Please note there are some hard coded file paths in the script below that you'll need to change.
 * 
 * Parameters
 *  indesignFilePath - full file path and name of InDesign file to test
 *  
 * NOTES
 *  Docs for ExtendScript: https://extendscript.docsforadobe.dev/
 *  ExtendScript Debugger Extension for VS Code (https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug)
 *  Install ExtendScript Toolkit and edit the script (and debug it directly with InDesign Server - sort of) (https://github.com/Adobe-CEP/CEP-Resources/tree/master/ExtendScript-Toolkit)
 *  
 * DESCRIPTION
 *  1. Opens the passed InDesign file
 *  2. Loads the profile at c:\\temp\\ids\\sample-profile.idpp
 *  3. Attempts to preflight the InDesign file using the given profile
 *  4. Writes the preflight report file to disk at c:\\temp\\ids\\preflight-report.txt  
 *  
 *  And it emits a lot of stuff to the console as it goes.
 * 
 */

app.consoleout("Init IDS test");
if (app.scriptArgs.isDefined("indesignFilePath")) {

    var indesignFilePath = app.scriptArgs.getValue("indesignFilePath");

    // TODO: replace these 
    var profileFilePath = "c:\\temp\\sample-profile.idpp";
    var preflightReportFilePath = "c:\\temp\\preflight-report.txt";

    app.consoleout("Opening " + indesignFilePath);
    var indesignFile = app.open(File(indesignFilePath));
    app.consoleout("Opened " + indesignFilePath);

    app.consoleout("Loading profile " + profileFilePath);
    var profile = app.loadPreflightProfile(File(profileFilePath));
    app.consoleout("Profile loaded");

    if (profile != null) {
        app.consoleout("Profile is not null");

        app.consoleout("Preflighting");
        var process = app.preflightProcesses.add(indesignFile, profile);
        app.consoleout("Wait for process");

        // NOTE: IDS sometimes says "No errors yet; still looking". Often with .idml files.
        // If you don't put waitForProcess() twice process.processResults will return "None" and you won't get a preflight report
        process.waitForProcess();
        process.waitForProcess();

        app.consoleout("Process results");
        results = process.processResults;
        app.consoleout("Results: " + results);

        if (results != "None") {
            process.saveReport(File(preflightReportFilePath));
        } else {
            app.consoleout("No preflight results");
        }

        process.remove();
        app.consoleout("Process removed");
        app.consoleout("End preflight");
    } else {
        app.consoleout("Could not load preflight profile");
    }
} else {
    app.consoleout("Could not find indesignFilePath parameter");
}

app.consoleout("End ids test");
"Finished";