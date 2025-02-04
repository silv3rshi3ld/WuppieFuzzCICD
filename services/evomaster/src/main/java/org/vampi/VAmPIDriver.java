package org.vampi;

import org.evomaster.client.java.controller.EmbeddedSutController;
import org.evomaster.client.java.controller.api.dto.AuthenticationDto;
import org.evomaster.client.java.controller.api.dto.SutInfoDto;
import org.evomaster.client.java.controller.problem.ProblemInfo;
import org.evomaster.client.java.controller.problem.RestProblem;

import java.util.List;

public class VAmPIDriver extends EmbeddedSutController {

    private final int sutPort = 5000;
    private Process sutProcess;

    public static void main(String[] args) {
        VAmPIDriver controller = new VAmPIDriver();
        controller.startSut();
        controller.startEmbeddedSutController(40100);
    }

    @Override
    public String startSut() {
        try {
            sutProcess = new ProcessBuilder()
                .command("docker", "compose", "-f", "services/evomaster/docker-compose.evomaster.yml", "up", "-d", "--build")
                .start();
            
            // Wait for VAmPI to be ready
            Thread.sleep(10000);
            
            return "http://localhost:" + sutPort;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void stopSut() {
        if (sutProcess != null) {
            sutProcess.destroy();
            try {
                new ProcessBuilder()
                    .command("docker", "compose", "-f", "services/evomaster/docker-compose.evomaster.yml", "down")
                    .start();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public String getPackagePrefixesToCover() {
        return "org.vampi.";
    }

    @Override
    public void resetStateOfSUT() {
        // Reset database or application state if needed
    }

    @Override
    public List<AuthenticationDto> getInfoForAuthentication() {
        return null; // Add auth info if needed
    }

    @Override
    public ProblemInfo getProblemInfo() {
        return new RestProblem(
            "http://localhost:" + sutPort + "/openapi_specs/openapi3.yml",
            null
        );
    }

    @Override
    public SutInfoDto.OutputFormat getPreferredOutputFormat() {
        return SutInfoDto.OutputFormat.PYTHON_UNITTEST;
    }
}
