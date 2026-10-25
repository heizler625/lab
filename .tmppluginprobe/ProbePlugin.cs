using TALXIS.DevKit.Build.Dataverse.Plugin;
namespace Plugins.Probe {
    [PluginStep(MessageName = "Create", PrimaryEntityName = "lab_warehousetransaction", Stage = StageEnum.PreValidation, ExecutionMode = ExecutionMode.Synchronous)]
    public class ProbePlugin : PluginBase {
        public ProbePlugin(string u, string s) : base(typeof(ProbePlugin)) {}
        protected override void ExecuteDataversePlugin(ILocalPluginContext ctx) {}
    }
}
